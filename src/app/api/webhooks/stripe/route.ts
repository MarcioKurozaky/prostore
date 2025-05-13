import { updateOrderToPaid } from "@/lib/actions/order.actions";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Instância do Stripe (sem apiVersion manual)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: NextRequest) {
  try {
    const sig = req.headers.get("stripe-signature") as string;
    const body = await req.text();

    // Verifica e constroi o evento com segurança
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );

    // Processa apenas o evento de pagamento concluído
    if (event.type === "charge.succeeded") {
      const object = event.data.object as Stripe.Charge;

      const orderId = object.metadata?.orderId;

      if (!orderId) {
        throw new Error("orderId não encontrado em metadata");
      }

      await updateOrderToPaid({
        orderId,
        paymentResult: {
          id: object.id,
          status: object.status,
          email_address: object.billing_details?.email ?? "",
          pricePaid: (object.amount / 100).toFixed(),
        },
      });

      return NextResponse.json({
        message: "Pedido marcado como pago com sucesso",
      });
    }

    // Se não for o evento que queremos, apenas retorna
    return NextResponse.json({
      message: "Evento ignorado: não é charge.succeeded",
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Erro no webhook Stripe:", err.message);
      return new NextResponse("Erro no Webhook: " + err.message, {
        status: 500,
      });
    }

    // Caso não seja um Error (muito raro)
    return new NextResponse("Erro desconhecido no Webhook", { status: 500 });
  }
}
