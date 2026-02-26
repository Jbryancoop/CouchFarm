import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Terms & Policies",
  description:
    "Terms of sale, return policy, and legal notices for Colorado Couch Ranch.",
};

export default function PoliciesPage() {
  const effectiveDate = "February 1, 2026";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-ranch-800 text-white py-8 sm:py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">
            Terms &amp; Policies
          </h1>
          <p className="text-ranch-200 text-xs sm:text-sm">
            Effective Date: {effectiveDate}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Intro */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-8 mb-5 sm:mb-8">
          <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
            Welcome to {siteConfig.name}. By purchasing any item from us,
            whether in person, online, or through any other channel, you
            acknowledge and agree to the following terms and conditions. Please
            read them carefully before completing your purchase.
          </p>
        </div>

        <div className="space-y-5 sm:space-y-8">
          {/* 1. All Sales Final */}
          <section className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <span className="w-7 h-7 sm:w-8 sm:h-8 bg-ranch-100 rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold text-ranch-700 shrink-0">
                1
              </span>
              All Sales Final
            </h2>
            <div className="space-y-2.5 sm:space-y-3 text-gray-600 leading-relaxed text-sm">
              <p>
                <strong className="text-gray-800">
                  All sales are final. No returns, refunds, exchanges, or
                  credits will be issued under any circumstances.
                </strong>{" "}
                This policy applies to all items sold by {siteConfig.name},
                including but not limited to couches, sectionals, loveseats,
                recliners, and any related furniture or accessories.
              </p>
              <p>
                By completing a purchase, you acknowledge that you have had the
                opportunity to inspect the item (either in person or through
                photos, descriptions, and condition ratings provided on our
                website) and are satisfied with its condition prior to purchase.
              </p>
            </div>
          </section>

          {/* 2. As-Is Condition */}
          <section className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <span className="w-7 h-7 sm:w-8 sm:h-8 bg-ranch-100 rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold text-ranch-700 shrink-0">
                2
              </span>
              As-Is Condition
            </h2>
            <div className="space-y-2.5 sm:space-y-3 text-gray-600 leading-relaxed text-sm">
              <p>
                All items are sold{" "}
                <strong className="text-gray-800">
                  &ldquo;as-is, where-is&rdquo;
                </strong>{" "}
                without any warranties, express or implied, including but not
                limited to warranties of merchantability, fitness for a
                particular purpose, or non-infringement. {siteConfig.name} makes
                no guarantees regarding the durability, lifespan, structural
                integrity, or cosmetic condition of any pre-owned furniture
                beyond what is expressly described in the item listing.
              </p>
              <p>
                While we make every effort to accurately describe and photograph
                each item, minor variations between listing descriptions and the
                actual product may exist due to the pre-owned nature of our
                inventory. Such variations do not constitute grounds for a
                return, refund, or claim.
              </p>
            </div>
          </section>

          {/* 3. Pricing & Payment */}
          <section className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <span className="w-7 h-7 sm:w-8 sm:h-8 bg-ranch-100 rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold text-ranch-700 shrink-0">
                3
              </span>
              Pricing &amp; Payment
            </h2>
            <div className="space-y-2.5 sm:space-y-3 text-gray-600 leading-relaxed text-sm">
              <p>
                All prices listed on our website or communicated through any
                channel are in United States Dollars (USD). Prices are subject
                to change without notice until a transaction is completed.{" "}
                {siteConfig.name} reserves the right to correct pricing errors
                at any time, including after an order has been placed.
              </p>
              <p>
                We accept payment via Cash, Venmo, Cash App, and credit card.
                Payment in full is required at the time of purchase. A
                transaction is considered complete once payment has been received
                and confirmed by {siteConfig.name}.
              </p>
              <p>
                Any applicable taxes, delivery fees, or additional charges will
                be communicated to the buyer prior to or at the time of
                purchase.
              </p>
            </div>
          </section>

          {/* 4. Pickup & Delivery */}
          <section className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <span className="w-7 h-7 sm:w-8 sm:h-8 bg-ranch-100 rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold text-ranch-700 shrink-0">
                4
              </span>
              Pickup &amp; Delivery
            </h2>
            <div className="space-y-2.5 sm:space-y-3 text-gray-600 leading-relaxed text-sm">
              <p>
                Unless otherwise agreed upon in writing, all purchases are
                available for pickup at our designated location in Colorado.
                Buyers are responsible for arranging transportation of purchased
                items. Title and risk of loss transfer to the buyer upon
                completion of payment.
              </p>
              <p>
                If delivery is arranged through {siteConfig.name} or a
                third-party carrier, the buyer assumes all risk of damage or
                loss once the item leaves our premises. {siteConfig.name} is not
                liable for any damage that occurs during transit, whether
                delivery is performed by us or a third party.
              </p>
              <p>
                Items must be picked up within seven (7) calendar days of
                purchase unless other arrangements have been made. Items not
                picked up within this period may be subject to a daily storage
                fee or, at our sole discretion, may be resold without refund to
                the original buyer.
              </p>
            </div>
          </section>

          {/* 5. Limitation of Liability */}
          <section className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <span className="w-7 h-7 sm:w-8 sm:h-8 bg-ranch-100 rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold text-ranch-700 shrink-0">
                5
              </span>
              Limitation of Liability
            </h2>
            <div className="space-y-2.5 sm:space-y-3 text-gray-600 leading-relaxed text-sm">
              <p>
                To the fullest extent permitted by applicable law,{" "}
                {siteConfig.name}, its owners, officers, employees, agents, and
                affiliates shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages arising out of or in
                connection with any purchase, including but not limited to
                property damage, personal injury, loss of use, or any other
                damages of any kind.
              </p>
              <p>
                In no event shall {siteConfig.name}&apos;s total liability
                exceed the purchase price of the item giving rise to the claim.
                This limitation applies regardless of the legal theory upon
                which such liability is based, whether in contract, tort
                (including negligence), strict liability, or otherwise.
              </p>
            </div>
          </section>

          {/* 6. Dispute Resolution & Arbitration */}
          <section className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-8 ring-1 ring-ranch-200">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <span className="w-7 h-7 sm:w-8 sm:h-8 bg-ranch-100 rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold text-ranch-700 shrink-0">
                6
              </span>
              Dispute Resolution &amp; Binding Arbitration
            </h2>
            <div className="space-y-2.5 sm:space-y-3 text-gray-600 leading-relaxed text-sm">
              <p>
                <strong className="text-gray-800">
                  Any dispute, controversy, or claim arising out of or relating
                  to any transaction with {siteConfig.name}, including the
                  breach, termination, or validity thereof, shall be resolved
                  exclusively through binding arbitration
                </strong>{" "}
                administered in the State of Colorado in accordance with the
                rules of the American Arbitration Association (AAA) then in
                effect.
              </p>
              <p>
                The arbitration shall be conducted by a single arbitrator. The
                decision of the arbitrator shall be final and binding on both
                parties and may be entered as a judgment in any court of
                competent jurisdiction. Each party shall bear its own costs and
                attorney&apos;s fees in connection with the arbitration, unless
                the arbitrator determines otherwise.
              </p>
              <p>
                <strong className="text-gray-800">
                  By purchasing from {siteConfig.name}, you agree to waive any
                  right to a jury trial or to participate in a class action
                  lawsuit or class-wide arbitration.
                </strong>{" "}
                All claims must be brought in the parties&apos; individual
                capacity and not as a plaintiff or class member in any purported
                class or representative proceeding.
              </p>
            </div>
          </section>

          {/* 7. Governing Law */}
          <section className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <span className="w-7 h-7 sm:w-8 sm:h-8 bg-ranch-100 rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold text-ranch-700 shrink-0">
                7
              </span>
              Governing Law &amp; Jurisdiction
            </h2>
            <div className="space-y-2.5 sm:space-y-3 text-gray-600 leading-relaxed text-sm">
              <p>
                These terms and conditions shall be governed by and construed in
                accordance with the laws of the State of Colorado, without
                regard to its conflict of law provisions. To the extent that any
                legal proceeding is permitted outside of arbitration, the
                exclusive venue shall be the state or federal courts located in
                the State of Colorado, and you hereby consent to the personal
                jurisdiction of such courts.
              </p>
            </div>
          </section>

          {/* 8. Indemnification */}
          <section className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <span className="w-7 h-7 sm:w-8 sm:h-8 bg-ranch-100 rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold text-ranch-700 shrink-0">
                8
              </span>
              Indemnification
            </h2>
            <div className="space-y-2.5 sm:space-y-3 text-gray-600 leading-relaxed text-sm">
              <p>
                You agree to indemnify, defend, and hold harmless{" "}
                {siteConfig.name}, its owners, officers, employees, and agents
                from and against any and all claims, damages, losses,
                liabilities, costs, and expenses (including reasonable
                attorney&apos;s fees) arising out of or in connection with your
                purchase, use, or misuse of any item purchased from us, or your
                violation of these terms.
              </p>
            </div>
          </section>

          {/* 9. Modifications */}
          <section className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <span className="w-7 h-7 sm:w-8 sm:h-8 bg-ranch-100 rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold text-ranch-700 shrink-0">
                9
              </span>
              Modifications to Terms
            </h2>
            <div className="space-y-2.5 sm:space-y-3 text-gray-600 leading-relaxed text-sm">
              <p>
                {siteConfig.name} reserves the right to modify, amend, or
                update these terms and policies at any time without prior
                notice. The most current version will always be available on our
                website. Continued purchases after any modifications constitutes
                acceptance of the revised terms.
              </p>
            </div>
          </section>

          {/* 10. Severability */}
          <section className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <span className="w-7 h-7 sm:w-8 sm:h-8 bg-ranch-100 rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold text-ranch-700 shrink-0">
                10
              </span>
              Severability
            </h2>
            <div className="space-y-2.5 sm:space-y-3 text-gray-600 leading-relaxed text-sm">
              <p>
                If any provision of these terms is found to be unenforceable or
                invalid by a court of competent jurisdiction or arbitrator, that
                provision shall be limited or eliminated to the minimum extent
                necessary so that the remaining provisions shall continue in
                full force and effect.
              </p>
            </div>
          </section>

          {/* 11. Entire Agreement */}
          <section className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <span className="w-7 h-7 sm:w-8 sm:h-8 bg-ranch-100 rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold text-ranch-700 shrink-0">
                11
              </span>
              Entire Agreement
            </h2>
            <div className="space-y-2.5 sm:space-y-3 text-gray-600 leading-relaxed text-sm">
              <p>
                These terms and policies constitute the entire agreement between
                you and {siteConfig.name} with respect to the purchase of any
                item and supersede all prior or contemporaneous communications,
                representations, or agreements, whether oral or written. No
                waiver of any term shall be deemed a further or continuing
                waiver of such term or any other term.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-ranch-50 rounded-xl sm:rounded-2xl border border-ranch-200 p-4 sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-ranch-900 mb-3 sm:mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
              Questions?
            </h2>
            <p className="text-sm text-ranch-700 leading-relaxed">
              If you have any questions about these terms and policies, please
              contact us at{" "}
              <a
                href={`mailto:${siteConfig.email}`}
                className="font-medium text-ranch-800 underline underline-offset-2 hover:text-ranch-900 transition"
              >
                {siteConfig.email}
              </a>{" "}
              before completing your purchase.
            </p>
          </section>
        </div>

        {/* Back to home */}
        <div className="mt-8 sm:mt-10 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
