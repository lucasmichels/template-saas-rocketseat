import { handleAuth } from "@/app/actions/handle-auth";

export default function Login() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold mb-10">Login</h1>
            <form action={handleAuth}>
                <button 
                type="submit" 
                className="bg-blue-500 text-white p-2 rounded-md cursor-pointer hover:bg-blue-600 transition-colors">
                    Signin with Google
                </button>
            </form>
        </div>
    )
}