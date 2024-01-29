import { SubscriptionButton } from "@/components/subscription-button";
import { checkSubscription } from "@/lib/subscription";
import { Check, X } from "lucide-react";

const SettingsPage = async () => {
  const isPro = await checkSubscription();

  return (
    <div className="h-full p-4 space-y-2">
      <h3 className="text-lg font-bold">Settings</h3>
      <div className="text-muted-foreground text-sm">
        {isPro ? (
          <div className="flex items-center justify-center">
            <div className="h-[500px] w-[350px] md:w-[400px] lg:w-[400px]  border-primary/40 rounded-sm border-2 shadow-md">
              <div className="text-[30px] flex items-center justify-center mt-5 text-primary font-bold">
                <div className="bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500 h-[35px] flex items-center justify-center rounded-md p-2">
                  Pro Plan
                </div>
              </div>
              <h2 className="text-primary mt-5 text-lg underline font-bold ml-2">
                What you get:
              </h2>
              <p className="inline-block mt-5 ml-2">
                <Check className="inline-block" />
                Chat With Companions
              </p>
              <p className="inline-block ml-2">
                <Check className="inline-block" />
                Create Custom AI Companions
              </p>
              <h1 className="text-primary mt-5 text-lg underline font-bold ml-2">
                What You Get when you Downgrade:
              </h1>
              <p className="inline-block mt-5 ml-2">
                <Check className="inline-block" />
                Chat With Companions
              </p>
              <p className="inline-block ml-2 ">
                <X className="inline-block" />
                Create Custom AI Companions
              </p>
              <h1 className="text-primary font-bold text-xl flex items-center justify-center mt-[70px]">
                Pro is for only $9.99 / mo
              </h1>
              <div className="flex items-center justify-center mt-[40px]">
                <SubscriptionButton isPro={isPro} />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <div className="h-[500px] w-[350px] md:w-[400px] lg:w-[400px]  border-primary/40 rounded-sm border-2 shadow-md">
              <div className="text-[30px] flex items-center justify-center mt-5 text-primary font-bold">
                <div className="bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500 h-[35px] flex items-center justify-center rounded-md p-2">
                  Free Plan
                </div>
              </div>
              <h2 className="text-primary mt-5 text-lg underline font-bold ml-2">
                What you get:
              </h2>
              <p className="inline-block mt-5 ml-2">
                <Check className="inline-block" />
                Chat With Companions
              </p>
              <p className="inline-block ml-2">
                <X className="inline-block" />
                Create Custom AI Companions
              </p>
              <h1 className="text-primary mt-5 text-lg underline font-bold ml-2">
                What You Get when you Upgrade to PRO:
              </h1>
              <p className="inline-block mt-5 ml-2">
                <Check className="inline-block" />
                Chat With Companions
              </p>
              <p className="inline-block ml-2 ">
                <Check className="inline-block" />
                Create Custom AI Companions
              </p>
              <h1 className="text-primary font-bold text-xl flex items-center justify-center mt-[70px]">
                For only $9.99 / mo
              </h1>
              <div className="flex items-center justify-center mt-[40px]">
                <SubscriptionButton isPro={isPro} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
