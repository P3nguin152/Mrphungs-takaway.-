import type { ReactNode } from 'react';
export const metadata = {
  title: "Terms of Service | Mr. Phung's Takeaway",
  description: "Terms for ordering from Mr. Phung's Takeaway. Cash on Delivery, delivery info, refunds, allergens, and more.",
};

export default function TermsPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-red-700 via-red-600 to-rose-600">
        <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle at 20% 10%, rgba(255,255,255,0.25), transparent 40%)'}} />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">Terms of Service</h1>
          <p className="mt-3 text-sm sm:text-base text-rose-100">Last updated: 8 August 2025</p>
          <p className="mt-6 max-w-3xl text-base sm:text-lg text-rose-50/90">
            Please read these terms before placing an order. By ordering, you agree to the terms below.
          </p>
        </div>
      </section>

      {/* Content card */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-14 pb-16">
        <div className="rounded-2xl border border-white/10 bg-gray-900/70 backdrop-blur-md shadow-2xl">
          <div className="p-6 sm:p-10">
            <div className="space-y-10">
              <div>
                <p className="text-gray-300">
                  Welcome to Mr. Phung&apos;s Takeaway. By placing an order on our website, you agree to the following terms.
                  If you do not agree, please do not place an order.
                </p>
              </div>

              <Section title="1. About Us">
                <p className="text-gray-300">
                  Mr. Phung&apos;s Takeaway, 4 Selby Avenue, Leeds, LS9 0HL. Telephone: 0113 248 3487.
                </p>
              </Section>

              <Section title="2. Service Overview">
                <ul className="list-disc pl-5 space-y-2 text-gray-300">
                  <li>We offer collection and local delivery of takeaway food.</li>
                  <li>
                    Payment is currently <span className="font-semibold">Cash on Delivery (COD)</span> or in-store on collection.
                  </li>
                  <li>All orders are subject to availability and acceptance.</li>
                </ul>
              </Section>

              <Section title="3. Ordering">
                <ul className="list-disc pl-5 space-y-2 text-gray-300">
                  <li>Ensure your delivery address and contact number are accurate so our driver can reach you.</li>
                  <li>If we cannot contact you or access your address, we may cancel the order.</li>
                  <li>For large orders, we may call to confirm before preparing your food.</li>
                </ul>
              </Section>

              <Section title="4. Prices and Minimum Order">
                <ul className="list-disc pl-5 space-y-2 text-gray-300">
                  <li>Prices are displayed on the website and may change without notice.</li>
                  <li>Delivery fees and any minimum order value (if applicable) are shown at checkout.</li>
                </ul>
              </Section>

              <Section title="5. Payment (Cash on Delivery)">
                <ul className="list-disc pl-5 space-y-2 text-gray-300">
                  <li>Pay the driver in cash upon delivery, or pay in cash/card in-store for collection.</li>
                  <li>Please have the correct amount when possible. Drivers carry limited change.</li>
                  <li>We reserve the right to refuse delivery if payment is not available on arrival.</li>
                </ul>
              </Section>

              <Section title="6. Delivery">
                <ul className="list-disc pl-5 space-y-2 text-gray-300">
                  <li>Delivery times are estimates and may vary due to weather, traffic, or order volume.</li>
                  <li>We deliver within a defined local radius from our shop; availability is shown at checkout.</li>
                  <li>Once delivered to the address provided, risk passes to you.</li>
                </ul>
              </Section>

              <Section title="7. Allergens and Dietary Information">
                <ul className="list-disc pl-5 space-y-2 text-gray-300">
                  <li>Please inform us of allergies before ordering. Some dishes may contain allergens.</li>
                  <li>
                    While we take care, our kitchen handles all major allergens and cross-contamination risks remain.
                  </li>
                </ul>
              </Section>

              <Section title="8. Cancellations, Refunds and Issues">
                <ul className="list-disc pl-5 space-y-2 text-gray-300">
                  <li>Orders can be cancelled before food preparation begins. Call us immediately.</li>
                  <li>
                    If there is an issue (missing items, quality concerns), contact us within a reasonable time so we can help.
                  </li>
                  <li>Any remedies may include replacement, partial refund, or credit at our discretion.</li>
                </ul>
              </Section>

              <Section title="9. Behaviour and Safety">
                <ul className="list-disc pl-5 space-y-2 text-gray-300">
                  <li>We may refuse service or delivery in cases of abuse, harassment, or unsafe conditions.</li>
                </ul>
              </Section>

              <Section title="10. Intellectual Property">
                <p className="text-gray-300">
                  Website content, menus, logos, and images are our intellectual property. You may not copy or reuse them
                  without permission.
                </p>
              </Section>

              <Section title="11. Liability">
                <p className="text-gray-300">
                  To the maximum extent permitted by law, we are not liable for indirect or consequential losses. Nothing
                  excludes liability where it would be unlawful to do so.
                </p>
              </Section>

              <Section title="12. Changes to These Terms">
                <p className="text-gray-300">
                  We may update these terms from time to time. The latest version will be posted on this page and applies to
                  orders placed after the update.
                </p>
              </Section>

              <Section title="13. Contact Us">
                <p className="text-gray-300">
                  For any questions about these terms or your order, please call 0113 248 3487
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
