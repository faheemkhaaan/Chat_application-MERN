import VideoCall from "./VideoCall";
import VideoControlls from "./VideoControlls";

interface VideoCallModalProps {
    isOpen: boolean;
    onClose: () => void;
}

function VideoCallModal({ isOpen, onClose }: VideoCallModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-gray-800/90 backdrop-blur-sm flex flex-col items-center justify-center p-4">
            <div className="w-full  max-w-6xl bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
                <div className="p-4 bg-gray-900 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-white">Video Call</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-300 hover:text-white transition-colors"
                        aria-label="Close call"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <VideoCall />

                <div className="p-4 bg-gray-900 flex justify-center">
                    <VideoControlls onClose={onClose} />
                </div>
            </div>
        </div>
    );
}

export default VideoCallModal;