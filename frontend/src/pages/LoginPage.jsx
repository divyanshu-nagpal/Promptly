import React, { useState } from "react";
import api from "../lib/api";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Key, AlertCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";


const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [twoFactorCode, setTwoFactorCode] = useState("");
    const [showTwoFactor, setShowTwoFactor] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const queryClient = useQueryClient();


    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await api.post("/api/auth/login", { 
                email, 
                password, 
                token: showTwoFactor ? twoFactorCode : undefined 
            });

            if (response.data.msg === "2FA code sent to email. Please enter it.") {
                setShowTwoFactor(true);
                setError("Enter your OTP sent to your email.");
            } else {
                localStorage.setItem("token", response.data.token);
                // Add this line to invalidate and refetch user data
                queryClient.invalidateQueries(["userData"]);
                queryClient.setQueryData(["isAuthenticated"], true);
                // Add this timeout before navigation
                setTimeout(() => {
                    navigate("/");
                }, 100);
            }
        } catch (error) {
            console.log(error.response);

            if (error.response) {
                if (error.response.data.msg === "2FA code sent to email. Please enter it.") {
                    setShowTwoFactor(true);
                    setError("Enter your OTP sent to your email.");
                } else if (error.response.data.msg === "Invalid 2FA code") {
                    setError("Invalid 2FA code. Please try again.");
                } else {
                    setError("Invalid email or password.");
                }
            } else {
                setError("An unexpected error occurred. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-gray-950">
                <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[radial-gradient(circle_at_30%_20%,#2563eb,transparent_40%)]"></div>
                <div className="absolute bottom-0 right-0 w-full h-full opacity-20 bg-[radial-gradient(circle_at_70%_80%,#8b5cf6,transparent_40%)]"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-5 bg-[radial-gradient(circle_at_50%_50%,#ffffff,transparent_70%)]"></div>
            </div>
            
            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBoMzB2MzBIMzB6TTAgMGgzMHYzMEgweiIgZmlsbD0iIzIwMjAyMCIgZmlsbC1vcGFjaXR5PSIuMDUiLz48L2c+PC9zdmc+')] opacity-10"></div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="flex justify-center">
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-900/30 text-blue-400 text-sm mb-6 border border-blue-800/50">
                        <span>Welcome Back</span>
                    </div>
                </div>
                <h2 className="text-center text-4xl font-bold text-white">
                    Sign in to your account
                </h2>
                <p className="mt-3 text-center text-gray-400">
                    Don't have an account?{" "}
                    <Link to="/register" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                        Sign up
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-gray-900 py-8 px-6 shadow-lg sm:rounded-xl border border-gray-800 backdrop-blur-sm">
                        <form className="space-y-6" onSubmit={handleLogin}>
                            {/* Email Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300">Email address</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="block w-full pl-10 pr-3 py-3 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-gray-500"
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300">Password</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="block w-full pl-10 pr-3 py-3 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-gray-500"
                                        placeholder="Enter your password"
                                    />
                                </div>
                                
                            </div>

                            {/* 2FA Code Input (Only if required) */}
                            {showTwoFactor && (
                                <div className="animate-fade-in">
                                    <label className="block text-sm font-medium text-gray-300">Two-Factor Code</label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Key className="h-5 w-5 text-gray-500" />
                                        </div>
                                        <input
                                            type="text"
                                            value={twoFactorCode}
                                            onChange={(e) => setTwoFactorCode(e.target.value)}
                                            required
                                            className="block w-full pl-10 pr-3 py-3 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-gray-500"
                                            placeholder="Enter 2FA code"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Error Message */}
                            {error && (
                                <div className="rounded-md bg-red-900/30 border border-red-800 p-4 animate-fade-in">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <AlertCircle className="h-5 w-5 text-red-400" />
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-red-400">{error}</h3>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
                                >
                                    {loading ? "Signing in..." : "Sign in"}
                                </button>
                            </div>
                        </form>

                        {/* Alternative Login Methods */}
                        <div className="mt-8">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-700" />
                                </div>
                                
                            </div>

     
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom animation styles */}
            <style jsx global>{`
                .animate-fade-in {
                    animation: fadeIn 0.6s ease-out forwards;
                }
                
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default LoginPage;