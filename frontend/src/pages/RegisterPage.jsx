import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Mail, User, Lock, AlertCircle, Image } from 'lucide-react';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);
        if (profilePhoto) {
            formData.append('profilePhoto', profilePhoto);
        }

        try {
            const response = await axios.post('/api/auth/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigate('/');
        } catch (error) {
            setError('User already exists or invalid input');
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePhoto(file);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 flex flex-col justify-center py-6 sm:px-6 lg:px-8 relative overflow-hidden">
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
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-900/30 text-blue-400 text-xs mb-3 border border-blue-800/50">
                        <span>Join Us Today</span>
                    </div>
                </div>
                <h2 className="text-center text-3xl font-bold text-white">
                    Create your account
                </h2>
                <p className="mt-2 text-center text-gray-400 text-sm">
                    Already have an account?{' '}
                    <a href="/login" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                        Sign in
                    </a>
                </p>
            </div>

            <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-gray-900 py-5 px-6 shadow-lg sm:rounded-xl border border-gray-800 backdrop-blur-sm">
                        <form className="space-y-4" onSubmit={handleRegister}>
                            {/* Username Input */}
                            <div>
                                <label className="block text-xs font-medium text-gray-300">Username</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-4 w-4 text-gray-500" />
                                    </div>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        className="block w-full pl-9 pr-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-gray-500"
                                        placeholder="Enter your username"
                                    />
                                </div>
                            </div>

                            {/* Email Input */}
                            <div>
                                <label className="block text-xs font-medium text-gray-300">Email address</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-4 w-4 text-gray-500" />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="block w-full pl-9 pr-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-gray-500"
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div>
                                <label className="block text-xs font-medium text-gray-300">Password</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-4 w-4 text-gray-500" />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="block w-full pl-9 pr-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-gray-500"
                                        placeholder="Create a password"
                                    />
                                </div>
                            </div>

                            {/* Profile Photo Input - Compact Layout */}
                            <div>
                                <label className="block text-xs font-medium text-gray-300 mb-1">Profile Photo</label>
                                <div className="flex items-center space-x-3">
                                    {profilePhoto ? (
                                        <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-blue-500 flex-shrink-0">
                                            <img
                                                src={URL.createObjectURL(profilePhoto)}
                                                alt="Profile Preview"
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-12 w-12 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700 flex-shrink-0">
                                            <User className="h-6 w-6 text-gray-500" />
                                        </div>
                                    )}
                                    <label className="cursor-pointer flex-1 py-2 px-3 flex items-center justify-center bg-gray-800 border border-gray-700 rounded-md text-gray-300 hover:bg-gray-700 transition-colors duration-200 text-xs">
                                        <Image className="h-4 w-4 mr-2 text-gray-400" />
                                        <span>{profilePhoto ? 'Change Photo' : 'Upload Photo'}</span>
                                        <input
                                            type="file"
                                            id="image"
                                            accept="image/*"
                                            onChange={handlePhotoChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Error Message - More compact */}
                            {error && (
                                <div className="rounded-md bg-red-900/30 border border-red-800 p-2 animate-fade-in">
                                    <div className="flex items-center">
                                        <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                                        <p className="ml-2 text-xs text-red-400">{error}</p>
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
                                >
                                    {loading ? "Creating..." : "Create Account"}
                                </button>
                            </div>
                        </form>

                        {/* Terms and Privacy - More compact */}
                        <div className="mt-3">
                            <p className="text-xxs text-center text-gray-500">
                                By signing up, you agree to our{' '}
                                <a href="#" className="text-blue-400 hover:text-blue-300">
                                    Terms
                                </a>{' '}
                                &{' '}
                                <a href="#" className="text-blue-400 hover:text-blue-300">
                                    Privacy Policy
                                </a>
                            </p>
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
                        transform: translateY(5px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .text-xxs {
                    font-size: 0.65rem;
                    line-height: 1rem;
                }
            `}</style>
        </div>
    );
};

export default RegisterPage;