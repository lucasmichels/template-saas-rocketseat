"use client"

import { useStripe } from "@/app/hooks/useStripe"

export default function Pagamentos() {

    const { 
        createPaymentStripeCheckout, 
        createSubscriptionStripeCheckout, 
        handleCreateStripePortal
    } = useStripe();

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold">Pagamentos</h1>
            <button 
                className="bg-blue-500 text-white p-2 rounded-md cursor-pointer hover:bg-blue-600 transition-colors mt-4" 
                onClick={() => 
                    createPaymentStripeCheckout({ 
                        testeId: "123", 
                    })
                }
            >
                Criar Pagamento Stripe
            </button>

            <button 
                className="bg-blue-500 text-white p-2 rounded-md cursor-pointer hover:bg-blue-600 transition-colors mt-4" 
                onClick={() => 
                    createSubscriptionStripeCheckout({ 
                        testeId: "123", 
                    })
                }
            >
                Criar Assinatura Stripe
            </button>

            <button 
                className="bg-blue-500 text-white p-2 rounded-md cursor-pointer hover:bg-blue-600 transition-colors mt-4" 
                onClick={handleCreateStripePortal}
            >
                Criar Portal de Pagamentos
            </button>
        </div>
    )
}