import { createFileRoute } from "@tanstack/react-router";
import { BackHomeBar } from "../components/kids/BigButton";
import { Mascot } from "../components/kids/Mascot";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Kids Pop & Learn — A Safe Learning Game" },
      {
        name: "description",
        content:
          "About Kids Pop & Learn: eight offline learning games for toddlers and preschoolers, built with child safety first.",
      },
      { property: "og:title", content: "About Kids Pop & Learn" },
      { property: "og:description", content: "Who made it, how it works and how to reach us." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <main className="page-sky pb-12">
      <div className="mx-auto w-full max-w-2xl">
        <BackHomeBar title="About" />
        <div className="mx-4 mt-4 grid gap-4 rounded-3xl bg-card px-5 py-6 text-sm leading-relaxed shadow-[0_8px_0_0_rgba(0,0,0,0.1)]">
          <div className="flex items-center gap-4">
            <Mascot size={80} />
            <div>
              <h2 className="font-display text-2xl">Kids Pop &amp; Learn</h2>
              <p className="font-display text-base text-muted-foreground">Play • Learn • Smile</p>
            </div>
          </div>
          <p>
            Meet Twinkle, your child&apos;s learning buddy. Twinkle asks simple questions out loud so
            children who cannot read yet can still play on their own.
          </p>
          <h3 className="font-display text-lg">What&apos;s inside</h3>
          <ul className="list-disc pl-5">
            <li>Colors, ABC, Numbers, Animals, Shapes, Fruits, Vehicles and a Matching memory game</li>
            <li>Five gentle levels per game, unlocked one at a time</li>
            <li>Stars, badges and one daily gift — no purchases, no loot boxes</li>
            <li>Wrong answers are never punished: a soft nudge and a hint, then try again</li>
          </ul>
          <h3 className="font-display text-lg">Made with care</h3>
          <p>
            All characters, illustrations and sounds are original. No copyrighted characters and no
            scary visuals or loud noises. Everything works offline.
          </p>
          <h3 className="font-display text-lg">Contact</h3>
          <p>
            Feedback and ideas are very welcome:{" "}
            <span className="font-bold">hello@kidspopandlearn.example</span>
          </p>
        </div>
      </div>
    </main>
  );
}
