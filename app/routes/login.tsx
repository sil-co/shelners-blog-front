import { useState } from "react";
import { useNavigate } from "react-router";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            const API_URL = `${import.meta.env.VITE_API_URL}/users/login`;
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({ email, password }),
            });
            if (!response.ok) {
                throw new Error("Invalid credentials");
            }
            const token = await response.text();
            localStorage.removeItem("token");
            localStorage.setItem("token", token);
            navigate("/"); // Use navigate instead of `redirect`
        } catch (err: any) {
            setError(err.message);
        }
    }

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
            <div className="bg-white p-8 shadow-lg rounded-lg max-w-sm w-full">
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition cursor-pointer"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}