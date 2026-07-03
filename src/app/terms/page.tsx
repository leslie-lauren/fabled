"use client";

import { useRouter } from "next/navigation";

export default function TermsPage() {
  const router = useRouter();
  return (
    <div className="min-h-dvh px-5 pt-8 pb-16 max-w-2xl mx-auto">
      <button
        onClick={() => router.back()}
        className="text-muted-2 text-sm mb-6 hover:text-text-secondary transition-colors"
      >
        ← Back
      </button>

      <h1 className="font-display text-3xl font-bold mb-2">Terms of Service</h1>
      <p className="text-muted-2 text-sm mb-8">Last updated: July 2026</p>

      <div className="space-y-6 text-text-secondary text-sm leading-relaxed">
        <section>
          <h2 className="font-display text-lg font-semibold text-text mb-2">1. Acceptance</h2>
          <p>
            By creating an account or using Fabled, you agree to these terms. Fabled is a
            social book club app that reads your taste, curates picks, and helps your tribe
            choose and discuss books together.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-text mb-2">2. Your account</h2>
          <p>
            You are responsible for keeping your login credentials secure and for all activity
            under your account. Provide accurate information and keep it up to date. You must be
            at least 13 years old to use Fabled.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-text mb-2">3. Acceptable use</h2>
          <p>
            Be kind to your tribe. Do not use Fabled to harass others, post unlawful content,
            attempt to access other users&apos; data, or disrupt the service. We may suspend
            accounts that violate these terms.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-text mb-2">4. Content</h2>
          <p>
            You retain ownership of the book lists and discussion contributions you create.
            Reading auras and recommendations are generated with AI and provided for
            entertainment and inspiration, not as professional advice.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-text mb-2">5. Changes</h2>
          <p>
            We may update these terms as Fabled evolves. Continued use after changes take effect
            means you accept the updated terms.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-text mb-2">6. Contact</h2>
          <p>Questions? Reach out through the app or to the Fabled team directly.</p>
        </section>
      </div>
    </div>
  );
}
