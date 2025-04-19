import React, { useEffect, useState } from 'react';
import api from "../lib/api";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, AlertCircle } from 'lucide-react';

const VerifyPage = () => {
    const { verificationtoken } = useParams();
    const [status, setStatus] = useState('Verifying your email...');
    const [isSuccess, setIsSuccess] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmail = async () => {
            if (!verificationtoken) {
                setStatus('Invalid or missing token.');
                setIsSuccess(false);
                return;
            }

            try {
                // Call the backend to verify the token
                const response = await api.get(`/api/auth/verify-email/${verificationtoken}`);
                setStatus('Email verified successfully!');
                setIsSuccess(true);
                
                // Set timeout to redirect after 2 seconds
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } catch (error) {
                setStatus(error.response?.data?.msg || 'Verification failed.');
                setIsSuccess(false);
            }
        };

        verifyEmail();
    }, [verificationtoken, navigate]);

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
                        <span>Email Verification</span>
                    </div>
                </div>
                <h2 className="text-center text-4xl font-bold text-white">
                    Verifying your account
                </h2>
                <p className="mt-3 text-center text-gray-400">
                    You'll be redirected to login shortly
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-gray-900 py-8 px-6 shadow-lg sm:rounded-xl border border-gray-800 backdrop-blur-sm">
                        <div className="flex flex-col items-center justify-center space-y-4">
                            {isSuccess === null ? (
                                <div className="animate-pulse flex flex-col items-center">
                                    <div className="w-10 h-10 bg-blue-600 rounded-full mb-4"></div>
                                    <p className="text-lg font-medium text-white">{status}</p>
                                </div>
                            ) : isSuccess ? (
                                <div className="animate-fade-in flex flex-col items-center">
                                    <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                                    <p className="text-lg font-medium text-white">{status}</p>
                                    <p className="text-sm text-gray-400 mt-2">Redirecting to login page...</p>
                                </div>
                            ) : (
                                <div className="animate-fade-in flex flex-col items-center">
                                    <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
                                    <p className="text-lg font-medium text-white">{status}</p>
                                    <Link 
                                        to="/login" 
                                        className="mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
                                    >
                                        Go to login
                                    </Link>
                                </div>
                            )}
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

export default VerifyPage;