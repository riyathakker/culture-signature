import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const FROM = process.env.RESEND_FROM || "Culture Signature <onboarding@resend.dev>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "riyathakker1329@gmail.com";

const resend = apiKey ? new Resend(apiKey) : null;

type SendArgs = {
  to: string | string[];
  subject: string;
  html: string;
};

async function send({ to, subject, html }: SendArgs) {
  if (!resend) {
    console.warn(`[email] RESEND_API_KEY not set — skipping email "${subject}"`);
    return;
  }
  try {
    const { error } = await resend.emails.send({ from: FROM, to, subject, html });
    if (error) {
      console.error(`[email] send failed "${subject}":`, JSON.stringify(error));
    }
  } catch (e) {
    console.error(`[email] send threw "${subject}":`, e);
  }
}

const inr = (n: number) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

function layout(title: string, body: string) {
  return `
  <div style="font-family:Georgia,'Times New Roman',serif;max-width:600px;margin:0 auto;color:#1a1a1a;background:#ffffff;">
    <div style="padding:28px 32px;border-bottom:2px solid #1a1a1a;">
      <h1 style="margin:0;font-size:20px;letter-spacing:3px;text-transform:uppercase;">Culture Signature</h1>
    </div>
    <div style="padding:32px;">
      <h2 style="font-size:18px;margin:0 0 16px;">${title}</h2>
      ${body}
    </div>
    <div style="padding:20px 32px;border-top:1px solid #e5e5e5;font-size:12px;color:#888;">
      This is an automated message from Culture Signature.
    </div>
  </div>`;
}

type OrderItemLike = {
  quantity: number;
  price: number;
  color?: string | null;
  product?: { name?: string | null } | null;
};

type OrderLike = {
  id: string;
  totalPrice: number;
  discountAmount?: number | null;
  status: string;
  customerName?: string | null;
  street?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  country?: string | null;
  phone?: string | null;
  shippedAt?: Date | null;
  deliveredAt?: Date | null;
  items?: OrderItemLike[];
};

function itemsTable(items: OrderItemLike[] = []) {
  const rows = items
    .map(
      (i) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #eee;">
          ${i.product?.name || "Item"}${i.color ? ` <span style="color:#888;">(${i.color})</span>` : ""}
          <span style="color:#888;"> × ${i.quantity}</span>
        </td>
        <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">${inr(i.price * i.quantity)}</td>
      </tr>`
    )
    .join("");
  return `<table style="width:100%;border-collapse:collapse;font-size:14px;margin:8px 0;">${rows}</table>`;
}

function addressBlock(o: OrderLike) {
  return `
  <p style="font-size:14px;line-height:1.6;margin:0;color:#444;">
    ${o.customerName || ""}<br/>
    ${o.street || ""}<br/>
    ${[o.city, o.state, o.zipCode].filter(Boolean).join(", ")}<br/>
    ${o.country || ""}<br/>
    ${o.phone ? `Phone: ${o.phone}` : ""}
  </p>`;
}

function orderSummary(o: OrderLike) {
  const discount = o.discountAmount
    ? `<p style="font-size:14px;margin:4px 0;color:#444;">Discount: -${inr(o.discountAmount)}</p>`
    : "";
  return `
    ${itemsTable(o.items)}
    ${discount}
    <p style="font-size:16px;font-weight:bold;margin:12px 0;">Total: ${inr(o.totalPrice)}</p>
    <h3 style="font-size:14px;text-transform:uppercase;letter-spacing:1px;margin:24px 0 8px;">Shipping to</h3>
    ${addressBlock(o)}
    <p style="font-size:12px;color:#888;margin-top:16px;">Order #${o.id}</p>`;
}

export async function sendOrderConfirmation(order: OrderLike, customerEmail?: string | null) {
  const summary = orderSummary(order);

  const tasks: Promise<void>[] = [];

  if (customerEmail) {
    tasks.push(
      send({
        to: customerEmail,
        subject: "Your Culture Signature order is confirmed",
        html: layout(
          "Thank you for your order",
          `<p style="font-size:14px;line-height:1.6;color:#444;">
             Hi ${order.customerName || "there"}, we've received your order and it's now being prepared.
           </p>${summary}`
        ),
      })
    );
  }

  tasks.push(
    send({
      to: ADMIN_EMAIL,
      subject: `New order received — ${inr(order.totalPrice)}`,
      html: layout(
        "New order received",
        `<p style="font-size:14px;line-height:1.6;color:#444;">
           A new order has been placed by ${order.customerName || "a customer"}${customerEmail ? ` (${customerEmail})` : ""}.
         </p>${summary}`
      ),
    })
  );

  await Promise.all(tasks);
}

export async function sendOrderStatusUpdate(order: OrderLike, customerEmail?: string | null) {
  const statusLabel = order.status.charAt(0) + order.status.slice(1).toLowerCase();
  const summary = orderSummary(order);

  const tasks: Promise<void>[] = [];

  if (customerEmail) {
    tasks.push(
      send({
        to: customerEmail,
        subject: `Your Culture Signature order is ${statusLabel}`,
        html: layout(
          `Your order is ${statusLabel}`,
          `<p style="font-size:14px;line-height:1.6;color:#444;">
             Hi ${order.customerName || "there"}, your order is now <strong>${statusLabel}</strong>.
           </p>${summary}`
        ),
      })
    );
  }

  await Promise.all(tasks);
}

function couponBox(code: string, percent: number, expiryDate?: Date) {
  const expiry = expiryDate
    ? expiryDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : null;
  return `
    <div style="margin:24px 0;padding:20px;border:1px dashed #caa04f;border-radius:8px;text-align:center;background:#fbf7ee;">
      <p style="margin:0 0 6px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#888;">Your ${percent}% coupon</p>
      <p style="margin:0;font-size:26px;font-weight:bold;letter-spacing:3px;color:#1a1a1a;">${code}</p>
      <p style="margin:10px 0 0;font-size:12px;color:#888;">${expiry ? `Valid until ${expiry} · ` : ""}single use</p>
    </div>`;
}

/** Waitlist signup → confirmation email (no coupon; the coupon comes at launch). */
export async function sendWaitlistWelcome(args: { to: string }) {
  await send({
    to: args.to,
    subject: "You're on the Culture Signature waitlist ✦",
    html: layout(
      "You're on the list ✦",
      `<p style="font-size:14px;line-height:1.6;color:#444;">
         Thank you for joining the Culture Signature waitlist. You're now among the first to know
         when we launch — and when we do, you'll receive an <strong>exclusive discount</strong> on your first order.
       </p>
       <p style="font-size:14px;line-height:1.6;color:#444;">
         Something timeless is being crafted. We can't wait to share it with you.
       </p>`
    ),
  });
}

/** Launch day → announcement email carrying the subscriber's personal coupon. */
export async function sendLaunchAnnouncement(args: {
  to: string;
  code: string;
  percent: number;
  expiryDate?: Date;
  shopUrl?: string;
}) {
  const { to, code, percent, expiryDate, shopUrl } = args;
  const cta = shopUrl
    ? `<div style="text-align:center;margin:24px 0;">
         <a href="${shopUrl}" style="display:inline-block;padding:14px 32px;background:#1a1a1a;color:#fff;text-decoration:none;font-size:13px;letter-spacing:2px;text-transform:uppercase;">Shop the collection</a>
       </div>`
    : "";
  await send({
    to,
    subject: `We're live — here's ${percent}% off your first order`,
    html: layout(
      "We've launched ✦",
      `<p style="font-size:14px;line-height:1.6;color:#444;">
         The wait is over — Culture Signature is now open. As a thank you for joining early,
         here's <strong>${percent}% off your first order</strong>.
       </p>
       ${couponBox(code, percent, expiryDate)}
       <p style="font-size:14px;line-height:1.6;color:#444;">
         Apply the code at checkout to claim your discount.
       </p>
       ${cta}`
    ),
  });
}

type InquiryLike = {
  id: string;
  name: string;
  email: string;
  subject?: string | null;
  message: string;
};

/** Contact-us form submitted → notification to admin. */
export async function sendContactInquiry(inquiry: InquiryLike) {
  await send({
    to: ADMIN_EMAIL,
    subject: `New enquiry${inquiry.subject ? `: ${inquiry.subject}` : ""} — from ${inquiry.name}`,
    html: layout(
      "New contact enquiry",
      `<p style="font-size:14px;line-height:1.6;color:#444;">
         <strong>Name:</strong> ${inquiry.name}<br/>
         <strong>Email:</strong> ${inquiry.email}<br/>
         ${inquiry.subject ? `<strong>Subject:</strong> ${inquiry.subject}<br/>` : ""}
       </p>
       <div style="background:#f7f7f7;border-left:3px solid #1a1a1a;padding:16px;margin-top:12px;font-size:14px;line-height:1.6;color:#333;white-space:pre-wrap;">${inquiry.message}</div>
       <p style="font-size:12px;color:#888;margin-top:16px;">Enquiry #${inquiry.id}</p>`
    ),
  });
}
