import { createFileRoute } from "@tanstack/react-router";
import { BackHomeBar } from "../components/kids/BigButton";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Kids Pop & Learn" },
      {
        name: "description",
        content:
          "Kids Pop & Learn collects no personal information, needs no account and stores progress only on the device.",
      },
      { property: "og:title", content: "Privacy Policy — Kids Pop & Learn" },
      { property: "og:description", content: "No accounts, no tracking, no personal data collection." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <main className="page-sky pb-12">
      <div className="mx-auto w-full max-w-2xl">
        <BackHomeBar title="Privacy" />
        <article className="mx-4 mt-4 grid gap-4 rounded-3xl bg-card px-5 py-6 text-sm leading-relaxed shadow-[0_8px_0_0_rgba(0,0,0,0.1)]">
          <h2 className="font-display text-2xl">Privacy Policy</h2>
          <p>
            Kids Pop &amp; Learn is made for young children. We designed it so that no personal
            information is ever needed to play.
          </p>
          <h3 className="font-display text-lg">What we do not collect</h3>
          <ul className="list-disc pl-5">
            <li>No name, email address or phone number</li>
            <li>No account or sign-in of any kind</li>
            <li>No location, contacts, photos or microphone access</li>
            <li>No behavioural advertising profiles and no third-party analytics</li>
          </ul>
          <h3 className="font-display text-lg">What is stored</h3>
          <p>
            Stars, level progress, badges and the sound settings are saved only in your device&apos;s
            local browser storage. They never leave the device and are removed when you clear the
            app data or tap “Reset all progress” in the parent area.
          </p>
          <h3 className="font-display text-lg">Advertising</h3>
          <p>
            This build contains no advertising. If a future Android release includes ads, they will be
            configured as child-directed and non-personalised, shown only between play sessions, never
            inside a game screen, and in line with the Google Play Families policy and AdMob policies
            for child-directed apps. Children are never asked or encouraged to tap an ad.
          </p>
          <h3 className="font-display text-lg">Offline use</h3>
          <p>The learning games work fully offline. No internet connection is required to play.</p>
          <h3 className="font-display text-lg">Contact</h3>
          <p>
            Questions about privacy? Write to us at{" "}
            <span className="font-bold">hello@kidspopandlearn.example</span>.
          </p>
        </article>
      </div>
    </main>
  );
}
