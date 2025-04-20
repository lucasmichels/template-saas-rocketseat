import stripe from "stripe";
import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { handleStripeSubscription } from "@/app/server/stripe/handle-subscription";
import { handleStripePayment } from "@/app/server/stripe/handle-payment";
import { handleStripeCancelSubscription } from "@/app/server/stripe/handle-cancel";

const secret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
    try {
        const body = await req.text();
        const headersList = await headers();
        const signature = await headersList.get("stripe-signature");
    
        if (!signature || !secret) {
            return new Response("No signature or secret", { status: 400 });
        }
    
        const event = stripe.webhooks.constructEvent(body, signature, secret);
    
        switch (event.type) {
            case "checkout.session.completed": //Pagamento aprovado, status = paid; pode ser pagamento unico ou assinatura
                const metadata = event.data.object.metadata;
    
                if (metadata?.price === process.env.STRIPE_PRODUCT_PRICE_ID) {
                    await handleStripePayment(event);
                }
                if (metadata?.price === process.env.STRIPE_SUBSCRIPTION_PRICE_ID) {
                    await handleStripeSubscription(event);
                }
                break;
    
            case "checkout.session.expired": // Expirou o tempo de pagamento
                console.log("Enviar um email para o usuario avisando que o pagamento expirou");
                break;
    
            case "checkout.session.async_payment_succeeded": //boleto pago
                console.log("Enviar um email para o usuario avisando que o pagamento foi aprovado");
                break;
            
            case "checkout.session.async_payment_failed": //boleto falhou
                console.log("Enviar um email para o usuario avisando que o pagamento falhou");
                break;
            
            case "customer.subscription.created": // Criou assinatura
                console.log("Mensagem de boas vindas porque acabou de assinar")
                break;
    
            case "customer.subscription.deleted": //cancelou assinatura
                await handleStripeCancelSubscription(event);
                break;

            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        return NextResponse.json({ message: "Webhook received" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });

    }
}