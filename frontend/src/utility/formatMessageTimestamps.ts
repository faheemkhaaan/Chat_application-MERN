export function formatMessageTimestamp(timestamp: string) {
    const now = new Date();
    const messageDate = new Date(timestamp);
    const diffInHours = Math.abs(now.getTime() - messageDate.getTime()) / 36e5; // 36e5 = 60*60*1000

    // Same day: show time (e.g., "2:30 PM")
    if (diffInHours < 24 && now.getDate() === messageDate.getDate()) {
        return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    // Yesterday: show "Yesterday"
    else if (diffInHours < 48 && now.getDate() - messageDate.getDate() === 1) {
        return 'Yesterday';
    }
    // Within a week: show day name (e.g., "Tuesday")
    else if (diffInHours < 168) {
        return messageDate.toLocaleDateString([], { weekday: 'long' });
    }
    // Older: show full date (e.g., "Jun 15, 2023")
    else {
        return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    }
}