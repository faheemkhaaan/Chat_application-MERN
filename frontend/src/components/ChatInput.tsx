import { lazy, Suspense, useCallback, useRef, useState, memo } from 'react';
import { EmojiClickData } from "emoji-picker-react";
import useClickOutSide from "../hooks/useClickOutSide";
import useTypingIndicator from "../hooks/useTypingIndicator";
import useConversation from "../hooks/useConversation";
import { IoIosSend } from "react-icons/io";
import { GoPaperclip } from "react-icons/go";
import { BsEmojiSmile } from 'react-icons/bs';
import useBlockUser from '../hooks/useBlockUser';
import ImagesPreview from "./ImagesPreview";
import VideoCallModal from './VideoCallModal';
import { FiVideo } from 'react-icons/fi';
import useVideoCall from '../hooks/useVideoCall';

const EmojiPicker = lazy(() => import('emoji-picker-react'));

const EmojiPickerWrapper = memo(({
    isOpen,
    onEmojiClick,
    onClose
}: {
    isOpen: boolean,
    onEmojiClick: (emoji: EmojiClickData) => void,
    onClose: () => void
}) => {
    const emojiPickerRef = useRef<HTMLDivElement>(null);
    useClickOutSide([emojiPickerRef], onClose, []);

    if (!isOpen) return null;

    return (
        <div ref={emojiPickerRef} className="absolute bottom-16 right-4 z-50">
            <Suspense fallback={<div className="w-[350px] h-[400px] bg-white rounded-lg shadow-lg border border-gray-200"></div>}>
                <EmojiPicker
                    width={350}
                    height={400}
                    skinTonesDisabled={false}
                    onEmojiClick={onEmojiClick}
                    previewConfig={{ showPreview: false }}
                />
            </Suspense>
        </div>
    );
});

function ChatInput() {
    const [emojiPicker, setEmojiPicker] = useState(false);
    const emojiButtonRef = useRef<HTMLButtonElement>(null);
    const inputImageRef = useRef<HTMLInputElement>(null);
    const {
        handleSendMessage,
        message,
        setMessage,
        handleSelectedImage,
        selectedImages,
        setSelectedImages,
        handleSendImagesMessage
    } = useConversation();
    const { handleTyping } = useTypingIndicator();
    const { isBlocked } = useBlockUser();
    const { startCall, isVideoCallOpen, setIsVideoCallOpen, endCall } = useVideoCall();

    const handleEmojiClick = useCallback((emoji: EmojiClickData) => {
        setMessage(prev => `${prev}${emoji.emoji}`);
    }, [setMessage]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
        handleTyping();
    }, [handleTyping, setMessage]);

    const handleEnterKey = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (isBlocked()) return;
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    }, [handleSendMessage, isBlocked]);

    const toggleEmojiPicker = useCallback(() => {
        setEmojiPicker(prev => !prev);
    }, []);

    const handleVideoCallClick = useCallback(() => {
        setIsVideoCallOpen();
        startCall();
    }, [setIsVideoCallOpen, startCall]);

    return (
        <div className="bg-white border-t border-gray-200 p-4">
            {selectedImages.length > 0 && (
                <ImagesPreview
                    selectedImages={selectedImages}
                    onClearImage={(index) => setSelectedImages(prev => prev.filter((_, i) => i !== index))}
                    onClearImages={() => setSelectedImages([])}
                    onSendImages={handleSendImagesMessage}
                />
            )}

            <div className="flex items-center gap-2">
                <button
                    onClick={() => inputImageRef.current?.click()}
                    className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                    aria-label="Attach file"
                >
                    <GoPaperclip size={20} />
                </button>

                <input
                    type="file"
                    ref={inputImageRef}
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleSelectedImage}
                    multiple
                />

                <div className="relative flex-1">
                    <input
                        onChange={handleInputChange}
                        onKeyDown={handleEnterKey}
                        value={message}
                        type="text"
                        placeholder="Type a message..."
                        className="w-full p-3 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        disabled={isBlocked()}
                    />
                </div>

                <div className="flex items-center gap-1">
                    <div className="relative">
                        <button
                            ref={emojiButtonRef}
                            onClick={toggleEmojiPicker}
                            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                            aria-label="Open emoji picker"
                        >
                            <BsEmojiSmile size={20} />
                        </button>
                        <EmojiPickerWrapper
                            isOpen={emojiPicker}
                            onEmojiClick={handleEmojiClick}
                            onClose={() => setEmojiPicker(false)}
                        />
                    </div>

                    <button
                        onClick={handleVideoCallClick}
                        className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                        aria-label="Start video call"
                    >
                        <FiVideo size={20} />
                    </button>

                    <button
                        onClick={handleSendMessage}
                        disabled={!message.trim()}
                        className={`p-2 rounded-full ${message.trim() ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                        aria-label="Send message"
                    >
                        <IoIosSend size={20} />
                    </button>
                </div>
            </div>

            <VideoCallModal
                isOpen={isVideoCallOpen}
                onClose={() => { endCall(); setIsVideoCallOpen() }}
            />
        </div>
    );
}

export default memo(ChatInput);