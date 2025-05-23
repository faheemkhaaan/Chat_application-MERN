import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/api';

const EmailVerification = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [verificationStatus, setVerificationStatus] = useState('verifying');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = searchParams.get("token");
        console.log(token);
        const verifyEmail = async () => {
            try {
                const response = await api.post(`/auth/verify-email?token=${token}`);

                if (response.data.success) {
                    setVerificationStatus('verified');
                    setTimeout(() => navigate('/login'), 3000);
                } else {
                    setVerificationStatus('failed');
                    setError(response.data.message || 'Email verification failed');
                }
            } catch (err: any) {
                setVerificationStatus('failed');
                setError(err.response?.data?.message || 'An error occurred during verification');
            }
        };

        if (token) {
            verifyEmail();
        } else {
            setVerificationStatus('failed');
            setError('No verification token provided');
        }
    }, [navigate, searchParams]);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 p-5">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Email Verification</h2>

                {verificationStatus === 'verifying' && (
                    <div className="flex flex-col items-center">
                        <p className="text-gray-600 mb-4">Verifying your email address...</p>
                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                {verificationStatus === 'verified' && (
                    <div className="text-center">
                        <p className="text-green-500 text-lg mb-2">✅ Your email has been successfully verified!</p>
                        <p className="text-gray-600">You will be redirected to the login page shortly.</p>
                    </div>
                )}

                {verificationStatus === 'failed' && (
                    <div className="text-center">
                        <p className="text-red-500 text-lg mb-4">❌ {error}</p>
                        <button
                            onClick={() => navigate('/resend-verification')}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                            Resend Verification Email
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmailVerification;