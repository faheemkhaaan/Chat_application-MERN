
import { FaPhone, FaPhoneSlash } from "react-icons/fa";
import useVideoCall from "../hooks/useVideoCall";

function IncomingCallNotification() {
    const { ringing, callFromId, acceptCall, declineCall } = useVideoCall();
    if (!ringing || !callFromId) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 bg-white rounded-xl shadow-xl p-4 w-64">
            <div className="flex flex-col items-center gap-3">
                <h3 className="font-medium text-gray-800">Incoming Call</h3>
                <div className="flex gap-4">
                    <button
                        onClick={acceptCall}
                        className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition-colors"
                        aria-label="Accept call"
                    >
                        <FaPhone size={16} />
                    </button>
                    <button
                        onClick={declineCall}
                        className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-colors"
                        aria-label="Decline call"
                    >
                        <FaPhoneSlash size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default IncomingCallNotification;