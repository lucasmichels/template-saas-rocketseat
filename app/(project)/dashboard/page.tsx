import { auth } from "@/app/lib/auth"
import { redirect } from "next/navigation"
import { handleAuth } from "@/app/actions/handle-auth"
export default async function Dashboard() { //async para esperar
    //server side
    const session = await auth();

    if (!session) {
        redirect("/login")
    }
    
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold">Protected Dashboard</h1>
            <p>
                {session?.user?.email 
                    ? session?.user?.email 
                    : "User not logged in"}
            </p>
        {
            session?.user?.email && (
                <form action={handleAuth}>
                    <button 
                        type="submit" 
                        className="bg-blue-500 text-white p-2 rounded-md cursor-pointer hover:bg-blue-600 transition-colors">
                            Sign Out
                    </button>
                </form>
            )
        }
        </div>
    )
}