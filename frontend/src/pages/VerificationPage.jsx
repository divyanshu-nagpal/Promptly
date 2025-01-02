import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'; // Use useParams to get the token

const VerifyPage = () => {
    const { verificationtoken } = useParams(); // Get the token from the URL
    const [status, setStatus] = useState('');
    // const navigate = useNavigate();

    useEffect(() => {
        const verifyEmail = async () => {
            if (!verificationtoken) {
                setStatus('Invalid or missing token.');
                return;
            }

            try {
                // Call the backend to verify the token
                const response = await axios.get(`/api/auth/verify-email/${verificationtoken}`);
                setStatus(response.data.msg || 'Verification successful!');
                // navigate('/login');
            } catch (error) {
                setStatus(error.response?.data?.msg || 'Verification failed.');
            }
        };

        verifyEmail();
    }, [verificationtoken]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <h2 className="text-lg font-medium">{status}</h2>
        </div>
    );
};

export default VerifyPage;
