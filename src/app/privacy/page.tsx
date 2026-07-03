"use client";

import { useRouter } from "next/navigation";

export default function PrivacyPage() {
  const router = useRouter();
  return (
    <div className="min-h-dvh px-5 pt-8 pb-16 max-w-2xl mx-auto">
      <button
        onClick={() => router.back()}
        className="text-muted-2 text-sm mb-6 hover:text-text-secondary transition-colors"
      >
        ← Back
      </button>

      <h1 className="font-display text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-muted-2 text-sm mb-8">Last updated: July 2026</p>

      <div className="space-y-6 text-text-secondary text-sm leading-relaxed">
        <section>
          <h2 className="font-display text-lg font-semibold text-text mb-2">What we collect</h2>
          <p>
            We collect the information you provide, such as your display name, email, the books
            you list, your reading aura, tribe memberships, votes, and discussion activity.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-text mb-2">How we use it</h2>
          <p>
            Your data powers the core experience: generating your reading aura, curating book
            decks for your tribe, tallying votes, and creating discussion questions. We do not
            sell your personal data.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-text mb-2">AI processing</h2>
          <p>
            Book lists and tribe context are sent to our AI provider to generate auras, decks,
            and discussion prompts. Only the information needed for these features is shared.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-text mb-2">Your choices</h2>
          <p>
            You can update your profile or delete your account at any time from Settings.
            Deleting your account permanently removes your aura, tribe memberships, and
            associated data.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-text mb-2">Security</h2>
          <p>
            We use industry-standard authentication and access controls to protect your data.
            No system is perfectly secure, so please use a strong, unique password.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-text mb-2">Contact</h2>
          <p>Questions about your privacy? Reach out through the app or to the Fabled team.</p>
        </section>
      </div>
    </div>
  );
}
