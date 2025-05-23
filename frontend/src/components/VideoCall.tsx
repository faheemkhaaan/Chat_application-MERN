import { useState } from "react";
import { useWebRtc } from "../context/WebRtcContext";

function VideoCall() {
  const { localVideoRef, remoteVideoRef, localVideoStreamRef } = useWebRtc();
  const [isLocalMinimized, setIsLocalMinimized] = useState(false);

  return (
    <div className="relative max-h-[80vh] flex-1 p-2 bg-gray-800">
      {/* Remote Video (Main View) */}
      <div className="relative w-full h-[70vh] min-h-[200px] bg-black rounded-lg overflow-hidden">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-contain"
        />
        {!remoteVideoRef.current?.srcObject && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-gray-400">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p>Waiting for remote stream...</p>
            </div>
          </div>
        )}
      </div>

      {/* Local Video (Picture-in-Picture) */}
      <div
        className={`absolute bottom-4 right-4 transition-all duration-300 ${isLocalMinimized ? 'size-24' : 'size-48'} bg-black rounded-lg overflow-hidden border-2 border-gray-600 shadow-lg cursor-pointer`}
        onClick={() => setIsLocalMinimized(!isLocalMinimized)}
      >
        <video
          ref={localVideoRef}
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        {!localVideoStreamRef.current && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/70 text-white text-xs">
            No camera
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoCall;