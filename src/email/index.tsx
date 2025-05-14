import { Resend } from "resend";
import { SENDER_EMAIL, APP_NAME } from "@/lib/constants";
import { Order } from "@/types";

import PurchaseReceiptEmail from "./purchase-receipt";
import ResetPasswordEmail from "./reset-password-email";

import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY ?? "");

export const sendPurchaseReceipt = async ({ order }: { order: Order }) => {
  if (!resend) throw new Error("Resend não configurado corretamente.");
  await resend.emails.send({
    from: `${APP_NAME} <${SENDER_EMAIL}>`,
    to: order.user.email,
    subject: `Order Confirmation ${order.id}`,
    react: <PurchaseReceiptEmail order={order} />,
  });
};

export async function sendResetEmail({
  to,
  name,
  resetUrl,
}: {
  to: string;
  name: string;
  resetUrl: string;
}) {
  if (!resend) throw new Error("Resend não configurado corretamente.");
  await resend.emails.send({
    from: `${APP_NAME} <${SENDER_EMAIL}>`,
    to,
    subject: "Redefinir senha",
    react: <ResetPasswordEmail userName={name} resetUrl={resetUrl} />,
  });
}
