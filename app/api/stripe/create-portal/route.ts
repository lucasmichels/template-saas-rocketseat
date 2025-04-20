import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { db } from "@/app/lib/firebase";
import stripe from "@/app/lib/stripe";

export async function POST(req: NextRequest) {

    const session = await auth()
    const userId = session?.user?.id

    if(!userId){
        return new Response("Unauthorized", { status: 401 })
    }

    try {
        const userRef = db.collection("users").doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return NextResponse.json("User not found", { status: 404 });
        }

        const customerId = userDoc.data()?.stripeCustomerId; //onde vem?
        
        if (!customerId) {
            return NextResponse.json("Customer not found", { status: 404 });
        }

        const portalSession = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${req.headers.get("origin")}/dahsboard`,
        });

        return NextResponse.json({ url: portalSession.url }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.error();
    }

}