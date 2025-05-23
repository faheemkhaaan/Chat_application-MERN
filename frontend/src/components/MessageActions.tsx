import { useState, useRef, useEffect, Suspense } from 'react';
import { FaTrash, FaSmile } from 'react-icons/fa';
import { EmojiClickData } from 'emoji-picker-react';
import { lazy } from 'react';
import useClickOutSide from '../hooks/useClickOutSide';

const EmojiPicker = lazy(() => import('emoji-picker-react'));

interface MessageActionsProps {
    messageId: string;
    onDelete: (messageId: string) => void;
    onReact: (messageId: string, emoji: string) => void;
    isOwnMessage: boolean;
}

function MessageActions({ messageId, onDelete, onReact, isOwnMessage }: MessageActionsProps) {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const emojiPickerRef = useRef<HTMLDivElement>(null);

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        onReact(messageId, emojiData.emoji);
        setShowEmojiPicker(false);
    };

    // Prevent body scroll when emoji picker is open
    useEffect(() => {
        if (showEmojiPicker) {
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = '';
            };
        }
    }, [showEmojiPicker]);

    // Close emoji picker when clicking outside

    useClickOutSide([emojiPickerRef], () => {
        setShowEmojiPicker(false);
    }, [showEmojiPicker]);


    return (
        <div className={`absolute ${isOwnMessage ? "-left-20" : "-right-12"} top-1/2 -translate-y-1/2 px-5 py-5 z-10`}>
            <div className={`flex bg-white rounded-lg shadow-md border border-gray-200`}>
                {isOwnMessage && (
                    <button
                        onClick={() => { onDelete(messageId); console.log(messageId) }}
                        className="p-1 text-red-500 hover:text-red-700"
                        aria-label="Delete message"
                    >
                        <FaTrash size={14} />
                    </button>
                )}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowEmojiPicker(!showEmojiPicker);
                    }}
                    className="p-1 text-gray-600 hover:text-blue-500"
                    aria-label="Add reaction"
                >
                    <FaSmile size={14} />
                </button>
            </div>

            {showEmojiPicker && (
                <div
                    ref={emojiPickerRef}
                    className={`fixed ${isOwnMessage ? "right-4" : "left-4"} bottom-0 z-50`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <Suspense fallback={<div className='w-[300px] h-[250px] rounded-sm bg-gray-200'></div>}>
                        <EmojiPicker
                            onEmojiClick={handleEmojiClick}
                            width={300}
                            height={250}
                            previewConfig={{ showPreview: false }} // Hide the preview bar
                            searchDisabled={true} // Disable search to remove input
                            skinTonesDisabled={true} // Simplify by disabling skin tones
                        />
                    </Suspense>
                </div>
            )}
        </div>
    );
}

export default MessageActions;