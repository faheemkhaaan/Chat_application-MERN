import { setUser } from "../../features/authSlice/authSlice";
import { addMessageToConversation, onAddReactionToUserMessage, onMessageDeleted, updateMessageStatus, updatePreview } from "../../features/conversationSlice/conversationSlice";
import { onGroupMessageReaction, updateGroup } from "../../features/groupSlice/slice";
// import { onAddReaction, onMessageDeleted, updateMessageStatus } from "../../features/messagesSlice";
import { connectionEstablished, connectionLost } from "../../features/socketSlice/slice";
import { AppDispatch } from "../../store/store";
import { ServerToClientEvents } from "../../types/socket.types";
import { onSocketEvent } from "./socket.service";


class EventListeners {
    private dispatch: AppDispatch
    private eventCleanups: Array<() => void> = []
    private selectedConversationId?: string
    private selectedGroupId?: string

    constructor(dispatch: AppDispatch) {
        this.dispatch = dispatch
    }

    updateSelection(conversationId?: string, groupId?: string) {
        this.selectedConversationId = conversationId
        this.selectedGroupId = groupId
        return this
    }

    setup() {
        this.setupConnection()
        this.setupMessageListeners()
        this.setupPreviewsListeners()
        this.setupUpdates()
        return this
    }
    setupConnection() {
        this.registerListener("connect", () => {
            this.dispatch(connectionEstablished());
        });
        this.registerListener("authentication error", (error: { message: string }) => {
            console.log(error.message)
        })
        this.registerListener("disconnect", () => {
            this.dispatch(connectionLost());
        });
        return this
    }

    setupPreviewsListeners() {
        this.registerListener("conversationPreviews", ({ success, conversations }) => {
            if (!success) { };
            if (!this.selectedConversationId) {
                this.dispatch(updatePreview(conversations));
                return this
            }
            const filterConversation = conversations.filter((convo: any) => convo._id !== this.selectedConversationId);
            this.dispatch(updatePreview(filterConversation))
        })
        return this
    }

    setupMessageListeners() {
        this.registerListener("message:send", (content) => {
            this.dispatch(addMessageToConversation(content));
        });
        this.registerListener("message:deleted", ({ message, senderId }) => {
            this.dispatch(onMessageDeleted({ userId: senderId, message }))
        });
        this.registerListener("message:reactions", ({ message, id }) => {
            console.log("adding reaction to a message on event message:reactions")
            // console.log(this.selectedConversationId, this.selectedGroupId);
            if (this.selectedConversationId) {
                this.dispatch(onAddReactionToUserMessage({ message, userId: id }));

            } else if (this.selectedGroupId) {
                this.dispatch(onGroupMessageReaction({ message, groupId: id }));
            }
        });

        this.registerListener("receivedMessageToGroup", (updatedGroup) => {
            this.dispatch(updateGroup(updatedGroup));
        });

        this.registerListener("messageRead", (message) => {
            console.log(message, "The message has been read")
            this.dispatch(updateMessageStatus(message));
        });
        this.registerListener("messageDeleivered", (message) => {
            this.dispatch(addMessageToConversation(message));
        })
        return this
    }
    setupUpdates() {
        this.registerListener("getAuthUser", (user) => {
            this.dispatch(setUser(user))
        });
        this.registerListener("server-error", ({ message, error }) => {
            console.log(message, error);
        })
        return this
    }

    private registerListener<E extends keyof ServerToClientEvents>(
        event: E,
        handler: ServerToClientEvents[E]
    ) {
        const cleanup = this.safeOnEvent(event, handler)
        this.eventCleanups.push(cleanup)
    }
    private safeOnEvent<E extends keyof ServerToClientEvents>
        (
            event: E,
            handler: ServerToClientEvents[E]
        ) {
        try {
            return onSocketEvent(event, handler)
        } catch (error) {
            console.log(`Error setting up ${event} listener:`, error)
            return () => { }
        }
    }

    cleanup() {
        this.eventCleanups.forEach(cleanup => cleanup())
        this.eventCleanups = []
    }
}




export default EventListeners