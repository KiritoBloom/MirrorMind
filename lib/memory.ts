import { Redis } from "@upstash/redis";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { Pinecone } from "@pinecone-database/pinecone"; // Updated import statement
import { PineconeStore } from "langchain/vectorstores/pinecone";

export type CompanionKey = {
  companionName: string;
  modelName: string;
  userId: string;
};

export class MemoryManager {
  private static instance: MemoryManager;
  private history: Redis;
  private vectorDBClient: Pinecone; // Updated type

  public constructor() {
    this.history = Redis.fromEnv();
  
    const apiKey = process.env.PINECONE_API_KEY;
    
    if (!apiKey) {
      throw new Error('PINECONE_API_KEY is not defined');
    }
  
    this.vectorDBClient = new Pinecone({
      apiKey: apiKey,
    });
  }
  
  

  public async init() {
    // Initialization is now done in the constructor, so this method can be removed
  }

  public async vectorSearch(
    recentChatHistory: string,
    companionFileName: string
  ) {
    const pineconeClient = this.vectorDBClient; // Removed type assertion

    const pineconeIndex = pineconeClient.Index(
      process.env.PINECONE_INDEX || ""
    );

    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
      { pineconeIndex }
    ); 

    const similarDocs = await vectorStore
      .similaritySearch(recentChatHistory, 3, { fileName: companionFileName })
      .catch((err) => {
        console.log("WARNING: failed to get vector search results.", err);
      });
    return similarDocs;
  }

  public static async getInstance(): Promise<MemoryManager> {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager();
      // Removed the init call as it's no longer needed
    }
    return MemoryManager.instance;
  }

  private generateRedisCompanionKey(companionKey: CompanionKey): string {
    return `${companionKey.companionName}-${companionKey.modelName}-${companionKey.userId}`;
  }

  public async writeToHistory(text: string, companionKey: CompanionKey) {
    if (!companionKey || typeof companionKey.userId == "undefined") {
      console.log("Companion key set incorrectly");
      return "";
    }

    const key = this.generateRedisCompanionKey(companionKey);
    const result = await this.history.zadd(key, {
      score: Date.now(),
      member: text,
    });

    return result;
  }

  public async readLatestHistory(companionKey: CompanionKey): Promise<string> {
    if (!companionKey || typeof companionKey.userId == "undefined") {
      console.log("Companion key set incorrectly");
      return "";
    }

    const key = this.generateRedisCompanionKey(companionKey);
    let result = await this.history.zrange(key, 0, Date.now(), {
      byScore: true,
    });

    result = result.slice(-30).reverse();
    const recentChats = result.reverse().join("\n");
    return recentChats;
  }

  public async seedChatHistory(
    seedContent: String,
    delimiter: string = "\n",
    companionKey: CompanionKey
  ) {
    const key = this.generateRedisCompanionKey(companionKey);
    if (await this.history.exists(key)) {
      console.log("User already has chat history");
      return;
    }

    const content = seedContent.split(delimiter);
    let counter = 0;
    for (const line of content) {
      await this.history.zadd(key, { score: counter, member: line });
      counter += 1;
    }
  }
}
