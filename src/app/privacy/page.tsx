import type { ReactNode } from 'react';
export const metadata = {
  title: "Privacy Policy | Mr. Phung's Takeaway",
  description: "How Mr. Phung's Takeaway collects, uses and protects your data under UK GDPR.",
};

export default function PrivacyPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-rose-700 via-rose-600 to-pink-600">
        <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle at 20% 10%, rgba(255,255,255,0.25), transparent 40%)'}} />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">Privacy Policy</h1>
          <p className="mt-3 text-sm sm:text-base text-rose-100">Last updated: 8 August 2025</p>
          <p className="mt-6 max-w-3xl text-base sm:text-lg text-rose-50/90">
            How we collect, use and protect your information when you order from us.
          </p>
        </div>
      </section>

      {/* Content card */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-14 pb-16">
        <div className="rounded-2xl border border-white/10 bg-gray-900/70 backdrop-blur-md shadow-2xl">
          <div className="p-6 sm:p-10">
            <div className="space-y-10">
              <Section title="1. Who We Are">
                <p className="text-gray-300">
                  Data Controller: Mr. Phung&apos;s Takeaway, 4 Selby Avenue, Leeds, LS9 0HL. Telephone: 0113 248 3487.
                </p>
              </Section>

              <Section title="2. Information We Collect">
                <ul className="list-disc pl-5 space-y-2 text-gray-300">
                  <li>Contact details: name, phone number, delivery address.</li>
                  <li>Order details: items ordered, special instructions, prices and delivery fee.</li>
                  <li>Payment method: Cash on Delivery (we do not store card details online).</li>
                  <li>Communications: messages or calls relating to your order.</li>
                  <li>Technical: basic logs needed to run the website (e.g. IP address, timestamps).</li>
                </ul>
              </Section>

              <Section title="3. How We Use Your Information">
                <ul className="list-disc pl-5 space-y-2 text-gray-300">
                  <li>To take, prepare and deliver your order.</li>
                  <li>To contact you about your order (confirmation, delivery issues).</li>
                  <li>To improve our menu and service and keep our site secure.</li>
                  <li>To meet legal or regulatory requirements.</li>
                </ul>
              </Section>

              <Section title="4. Legal Bases for Processing">
                <ul className="list-disc pl-5 space-y-2 text-gray-300">
                  <li><span className="font-semibold">Contract:</span> to fulfil your order.</li>
                  <li><span className="font-semibold">Legitimate interests:</span> running our business, improving services, preventing fraud.</li>
                  <li><span className="font-semibold">Legal obligation:</span> keeping records we must retain by law.</li>
                </ul>
              </Section>

              <Section title="5. Sharing Your Information">
                <ul className="list-disc pl-5 space-y-2 text-gray-300">
                  <li>Delivery drivers for the purpose of delivering your order.</li>
                  <li>Service providers who host our website or IT systems, under confidentiality obligations.</li>
                  <li>Authorities where required by law or to protect rights and safety.</li>
                </ul>
              </Section>

              <Section title="6. Data Retention">
                <p className="text-gray-300">
                  We keep order records for as long as necessary for our business and legal purposes, typically up to 12 months
                  for routine operational needs, and longer where required by law (e.g. tax records).
                </p>
              </Section>

              <Section title="7. Your Rights">
                <ul className="list-disc pl-5 space-y-2 text-gray-300">
                  <li>Access, rectification, erasure, and restriction of processing.</li>
                  <li>Objection to processing in certain circumstances.</li>
                  <li>Data portability where applicable.</li>
                  <li>To exercise your rights, contact us using the details below.</li>
                </ul>
              </Section>

              <Section title="8. Cookies">
                <p className="text-gray-300">
                  We use only essential cookies/technologies necessary to operate the website and take orders. If we introduce
                  analytics or marketing cookies in the future, we will update this policy and request consent where required.
                </p>
              </Section>

              <Section title="9. Security">
                <p className="text-gray-300">
                  We take appropriate technical and organisational measures to protect your data. No system is 100% secure, but
                  we work to protect your information against unauthorised access and misuse.
                </p>
              </Section>

              <Section title="10. Children">
                <p className="text-gray-300">
                  Our service is intended for customers aged 16 and over. If you believe a child provided us with personal data
                  without consent, please contact us so we can delete it.
                </p>
              </Section>

              <Section title="11. Changes to This Policy">
                <p className="text-gray-300">
                  We may update this policy from time to time. The latest version will always be available on this page.
                </p>
              </Section>

              <Section title="12. Contact">
                <p className="text-gray-300">
                  To contact us about privacy or to exercise your rights, call 0113 248 3487 or write to us at 4 Selby Avenue,
                  Leeds, LS9 0HL.
                </p>
                <p className="text-gray-300 mt-2">
                </p>
              </Section>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-xl sm:text-2xl font-semibold text-white">{title}</h2>
      <div className="mt-3 text-base leading-7">
        {children}
      </div>
      <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
