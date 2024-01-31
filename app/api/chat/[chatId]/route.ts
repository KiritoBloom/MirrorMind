import { StreamingTextResponse, LangChainStream } from "ai";
import { auth, currentUser } from "@clerk/nextjs";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { CallbackManager } from "langchain/callbacks";
import { NextResponse } from "next/server";

import { MemoryManager } from "@/lib/memory";
import { rateLimit } from "@/lib/rate-limit";
import prismadb from "@/lib/prismadb";

export async function POST(
  request: Request,
  { params }: { params: { chatId: string } }
) {
  try {
    const { prompt } = await request.json();
    const user = await currentUser();

    if (!user || !user.firstName || !user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const identifier = request.url + "-" + user.id;
    const { success } = await rateLimit(identifier);

    if (!success) {
      return new NextResponse("Rate limit exceeded", { status: 429 });
    }

    const companion = await prismadb.companion.update({
      where: {
        id: params.chatId,
      },
      data: {
        messages: {
          create: {
            content: prompt,
            role: "user",
            userId: user.id,
          },
        },
      },
    });

    if (!companion) {
      return new NextResponse("Companion not found", { status: 404 });
    }

    const name = companion.id;
    const companion_file_name = name + ".txt";

    const companionKey = {
      companionName: name!,
      userId: user.id,
      modelName: "gpt3_5",
    };
    const memoryManager = await MemoryManager.getInstance();

    const records = await memoryManager.readLatestHistory(companionKey);
    if (records.length === 0) {
      await memoryManager.seedChatHistory(
        companion.seed,
        "\n\n",
        companionKey
      );
    }
    await memoryManager.writeToHistory(
      "User: " + prompt + "\n",
      companionKey
    );

    const recentChatHistory = await memoryManager.readLatestHistory(
      companionKey
    );
    const similarDocs = await memoryManager.vectorSearch(
      recentChatHistory,
      companion_file_name
    );

    let relevantHistory = "";
    if (!!similarDocs && similarDocs.length !== 0) {
      relevantHistory = similarDocs
        .map((doc) => doc.pageContent)
        .join("\n");
    }

    const { handlers } = LangChainStream();
    const model = new ChatOpenAI({
      modelName: "gpt-3.5-turbo-1106",
      temperature: 0.9,
      openAIApiKey: process.env.OPENAI_API_KEY,
      maxTokens: 100,
    });

    model.verbose = true;
    const responseObj = await model
  .invoke(
    `
    ONLY generate plain sentences without prefix of who is speaking. DO NOT use ${companion.name}: prefix. 

    ${companion.instructions}

    Below are relevant details about ${companion.name}'s past and the conversation you are in.
    ${relevantHistory}

    ${recentChatHistory}\n${companion.name}:`
  )
  .catch(console.error);

  const responseContent = responseObj?.content || "";

  // Use replace method with regular expression to replace all commas
  const cleaned = responseContent.toString()
  const chunks = cleaned.split("\n");
  const trimmedResponse = chunks[0].trim();
  
  await memoryManager.writeToHistory( trimmedResponse, companionKey);
  
  var Readable = require("stream").Readable;
  let s = new Readable();
  s.push(trimmedResponse);
  s.push(null);
  
  if (trimmedResponse !== undefined && trimmedResponse.length > 1) {
    await prismadb.companion.update({
      where: {
        id: params.chatId,
      },
      data: {
        messages: {
          create: {
            content: trimmedResponse,
            role: "system",
            userId: user.id,
          },
        },
      },
    });
  }
    return new StreamingTextResponse(s);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export const maxDuration = 10;
