import ChatHeader from './ChatHeader'
import ChatInput from './ChatInput'
import ChatMessages from './ChatMessages'
import { FiMessageSquare, FiUsers } from 'react-icons/fi'
import IncomingCallNotification from './IncomingCallNotification'

function ChatArea({ selectedUserId, selectedGroup }: { selectedUserId: string, selectedGroup: string }) {
    if (!selectedUserId && !selectedGroup) {
        return (
            <div className='w-full h-full flex flex-col justify-center items-center bg-[#F8F9FA] p-8 text-center'>
                <div className="max-w-md space-y-6">
                    <div className="flex justify-center">
                        <div className="p-4 bg-blue-100 rounded-full">
                            <FiMessageSquare className="text-blue-600 text-4xl" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Welcome to Web Chat</h2>
                    <p className="text-gray-600">
                        Select a conversation or start a new one to begin messaging.
                        Your conversations will appear here.
                    </p>
                    <div className="flex items-center justify-center gap-4 pt-4">
                        <div className="flex items-center gap-2 text-gray-500">
                            <FiUsers className="text-lg" />
                            <span>Connect with friends</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full grid grid-cols-1 grid-rows-[80px_1fr_80px] h-screen p-4 bg-[#F8F9FA]">
            <ChatHeader />
            <ChatMessages />
            <ChatInput />
            <IncomingCallNotification />
        </div>
    )
}

export default ChatArea