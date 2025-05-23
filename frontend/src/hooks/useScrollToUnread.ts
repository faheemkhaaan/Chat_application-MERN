import { useCallback, useEffect, useRef, useState } from "react";
import { Message } from "../types/slice.types";

interface ScrollToUnreadProp {
    messages: Message[];
    currentUserId: string | undefined;
    isInitialLoad: boolean
}
function useScrollToUnread({ messages, currentUserId, isInitialLoad }: ScrollToUnreadProp) {
    const scrollbarRef = useRef<HTMLDivElement>(null);
    const [initialUnreadIndex, setInitialUnreadIndex] = useState<number | null>(null);
    const [hasScrolledToUnread, setHasScrolledToUnread] = useState(false);

    const findFirstUnread = useCallback((msgs: Message[] | undefined) => {
        if (!msgs || !currentUserId) return null;
        return msgs.findIndex((message) =>
            message.senderId._id !== currentUserId && message.status !== 'read'
        ) ?? null;
    }, [currentUserId]);

    useEffect(() => {
        if (isInitialLoad && messages && initialUnreadIndex === null) {
            const index = findFirstUnread(messages);
            if (index !== -1 && index !== initialUnreadIndex) {
                setInitialUnreadIndex(index);
            }
        }
    }, [messages, isInitialLoad, findFirstUnread]);
    useEffect(() => {
        const scrollbar = scrollbarRef.current;
        if (!scrollbar || !messages) return;
        scrollbar.classList.remove("scroll-smooth")
        if (initialUnreadIndex !== null && !hasScrolledToUnread) {
            const messageElement = document.getElementById(`message-${initialUnreadIndex}`);
            if (messageElement) {
                setTimeout(() => {
                    messageElement.scrollIntoView({ behavior: 'auto', block: 'center' });
                    setHasScrolledToUnread(true);
                }, 100);
            }
        }
        else {
            scrollbar.scrollTop = scrollbar.scrollHeight;
        }
        const timer = setTimeout(() => {
            scrollbar.classList.add("scroll-smooth");
        }, 100)
        return () => clearTimeout(timer)
    }, [messages, initialUnreadIndex, hasScrolledToUnread]);

    return { scrollbarRef };
}
export default useScrollToUnread