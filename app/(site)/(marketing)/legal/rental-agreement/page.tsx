import { Metadata } from "next";
import { AGREEMENT_VERSION, BALANCE_DUE_DAYS, CARD_FEE_RATE } from "@/lib/booking";
import { CONTACT } from "@/lib/site";

export const metadata: Metadata = {
    title: "Rental Agreement",
    description: "The Floral Collection rental agreement for online wedding package bookings.",
};

/**
 * 在线预订时客户勾选同意 + 输入全名签署的协议。
 * TODO: 以下条款依据网站 FAQ 整理，上线前请客户 / 律师审定正文；修改后同步递增 lib/booking.ts 的 AGREEMENT_VERSION。
 */
export default function RentalAgreementPage() {
    const fee = `${CARD_FEE_RATE * 100}%`;
    return (
        <section className="faq-page legal-page">
            <div className="faq-page-inner legal-inner">
                <span className="package-detail-overline">Version {AGREEMENT_VERSION}</span>
                <h1 className="faq-page-title">Rental Agreement</h1>
                <span className="floral-divider" aria-hidden="true" />

                <ol className="legal-list">
                    <li>
                        <h2>Reservation</h2>
                        <p>Your event date is reserved only after The Floral Collection has received both (a) a 50% deposit of the package price and (b) your signed acceptance of this agreement. Dates are not reserved until both have been received.</p>
                    </li>
                    <li>
                        <h2>Deposit</h2>
                        <p>The 50% deposit is <strong>nonrefundable</strong>.</p>
                    </li>
                    <li>
                        <h2>Balance</h2>
                        <p>The remaining 50% balance must be paid in full no later than <strong>{BALANCE_DUE_DAYS} days before your event date</strong>. If you book within {BALANCE_DUE_DAYS} days of your event, the full package price is due at booking. You can pay your balance online at any time using your order number.</p>
                    </li>
                    <li>
                        <h2>Card processing fee</h2>
                        <p>Credit and debit card payments are subject to a {fee} processing fee, shown separately before you pay.</p>
                    </li>
                    <li>
                        <h2>Package inclusions</h2>
                        <p>Each package includes a predetermined selection and quantity of décor items. Items cannot be exchanged or combined between packages. Our designer will curate the design to complement your venue and inspiration within the inclusions of your selected package. Final arrangements may vary based on venue, layout, color palette and package.</p>
                    </li>
                    <li>
                        <h2>Delivery, setup &amp; removal</h2>
                        <p>Delivery, professional installation and post-event removal are included in every package. A venue visit may be conducted when needed. Linens, dinnerware, glassware, flatware and other table-setting rentals are not provided.</p>
                    </li>
                    <li>
                        <h2>Changes &amp; cancellations</h2>
                        <p>Event dates may be rescheduled and packages may be upgraded, subject to the availability of our staff, floral pieces and rental inventory. Additional terms or fees may apply depending on the requested change. Deposits are nonrefundable.</p>
                    </li>
                    <li>
                        <h2>Rental items</h2>
                        <p>All florals and décor remain the property of The Floral Collection and are provided on a rental basis for the duration of your event.</p>
                    </li>
                    <li>
                        <h2>Electronic signature</h2>
                        <p>By checking the agreement box and typing your full name at checkout, you agree that this constitutes your electronic signature and acceptance of this agreement. The date, time and version of the agreement you accepted are recorded with your order.</p>
                    </li>
                </ol>

                <p className="legal-contact">Questions? Contact us at <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> or <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>.</p>
            </div>
        </section>
    );
}
