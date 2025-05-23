import { memo } from "react";

interface TypingIndicatorProps {
    isTyping: boolean;
    typingUserId: string | null;
    selectedUserId: string | undefined;
    users: Record<string, { username: string }>;
}

const TypingIndicator = memo(({
    isTyping,
    typingUserId,
    selectedUserId,
    users
}: TypingIndicatorProps) => {
    if (!isTyping || !typingUserId || !selectedUserId || typingUserId !== selectedUserId) return null


    return (
        <p className="absolute bottom-2 left-1 z-50 bg-amber-50 p-1 rounded-full">
            {`${users[typingUserId].username} is typing...`}
        </p>
    );
});

TypingIndicator.displayName = 'TypingIndicator';

export default TypingIndicator