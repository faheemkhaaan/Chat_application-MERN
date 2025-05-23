import { useWebRtc } from "../context/WebRtcContext";
import { FiMic, FiMicOff, FiVideo, FiVideoOff, FiPhone } from "react-icons/fi";

interface VideoControllsProps {
    onClose: () => void;
}

function VideoControlls({ onClose }: VideoControllsProps) {
    const { closeVideoCall, audio, video, toggleAudio, toggleVideo } = useWebRtc();

    return (
        <div className="flex gap-4">
            {/* Audio Toggle */}
            <button
                onClick={() => toggleAudio(!audio)}
                className={`p-3 rounded-full ${audio ? 'bg-gray-700 text-white' : 'bg-red-500 text-white'} hover:bg-opacity-80 transition-colors`}
                aria-label={audio ? "Mute microphone" : "Unmute microphone"}
            >
                {audio ? <FiMic size={20} /> : <FiMicOff size={20} />}
            </button>

            {/* Video Toggle */}
            <button
                onClick={() => toggleVideo(!video)}
                className={`p-3 rounded-full ${video ? 'bg-gray-700 text-white' : 'bg-red-500 text-white'} hover:bg-opacity-80 transition-colors`}
                aria-label={video ? "Disable camera" : "Enable camera"}
            >
                {video ? <FiVideo size={20} /> : <FiVideoOff size={20} />}
            </button>

            {/* End Call */}
            <button
                onClick={() => { closeVideoCall(); onClose(); }}
                className="p-3 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
                aria-label="End call"
            >
                <FiPhone size={20} />
            </button>
        </div>
    );
}

export default VideoControlls;