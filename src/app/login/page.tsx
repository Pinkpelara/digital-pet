import { AuthPanel } from "@/components/auth/AuthPanel";
import { LiveStage } from "@/components/stage/LiveStage";
import { WhenVisible } from "@/components/site/WhenVisible";
import { PageHero } from "@/components/site/KineticTitle";

export const metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div className="bg-paper pb-20">
      <PageHero
        kicker="Sign in"
        title="Come in quietly."
        lede="They are already in the room. You are just catching up."
      />
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 md:grid-cols-[1.05fr_0.95fr] md:px-10">
        <WhenVisible once className="stage-frame min-h-[420px] overflow-hidden rounded-[1.8rem]">
          <LiveStage
            species="mochi"
            mood="nap"
            className="h-full min-h-[420px] w-full"
            cameraZ={5.4}
            followPointer
            quality="medium"
          />
        </WhenVisible>
        <AuthPanel />
      </div>
    </div>
  );
}
