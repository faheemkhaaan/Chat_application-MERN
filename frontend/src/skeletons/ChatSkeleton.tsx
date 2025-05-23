// src/components/skeletons/ChatSkeleton.tsx
function ChatSkeleton() {
    return (
        <section className="grid md:grid-cols-[300px_minmax(900px,_1fr)] h-screen animate-pulse">
            {/* Sidebar skeleton */}
            <div className="bg-gray-200 dark:bg-gray-800 p-4">
                <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded mb-4" />
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-10 bg-gray-300 dark:bg-gray-700 rounded mb-2" />
                ))}
            </div>

            {/* Chat area skeleton */}
            <div className="flex flex-col h-full p-4">
                {/* Header */}
                <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded mb-4" />
                {/* Messages */}
                <div className="flex-1 space-y-3 overflow-hidden">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className={`w-${i % 2 === 0 ? "3/4" : "1/2"} h-6 bg-gray-300 dark:bg-gray-700 rounded`} />
                    ))}
                </div>
                {/* Input */}
                <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded mt-4" />
            </div>
        </section>
    );
}

export default ChatSkeleton;
