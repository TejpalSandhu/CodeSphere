import { useState, useEffect } from "react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import { initializeStreamClient, disconnectStreamClient } from "../lib/stream";
import { sessionApi } from "../api/sessions";

// the video client and the chat client are singletons, so a new connection must wait
// until the previous one is fully torn down (StrictMode double effects, fast re-renders)
let pendingCleanup = Promise.resolve();

function useStreamClient(session, loadingSession, isHost, isParticipant) {
    const [streamClient, setStreamClient] = useState(null);
    const [call, setCall] = useState(null);
    const [chatClient, setChatClient] = useState(null);
    const [channel, setChannel] = useState(null);
    const [isInitializingCall, setIsInitializingCall] = useState(true);

    // depend on primitives only - the session object changes on every refetch that returns
    // new data (e.g. when a participant joins), which would otherwise tear down the call
    const callId = session?.callId;
    const sessionStatus = session?.status;

    useEffect(() => {
        let cancelled = false;
        let videoCall = null;
        let chatClientInstance = null;

        const initCall = async () => {
            if (!callId) return;
            if (!isHost && !isParticipant) return;
            if (sessionStatus === "completed") return;

            setIsInitializingCall(true);

            try {
                await pendingCleanup;
                if (cancelled) return;

                const { token, userId, userName, userImage } = await sessionApi.getStreamToken();
                if (cancelled) return;

                const client = await initializeStreamClient(
                    {
                        id: userId,
                        name: userName,
                        image: userImage,
                    },
                    token
                );
                if (cancelled) return;

                setStreamClient(client);

                videoCall = client.call("default", callId);
                await videoCall.join({ create: true });
                if (cancelled) return;
                setCall(videoCall);

                const apiKey = import.meta.env.VITE_STREAM_API_KEY;
                chatClientInstance = StreamChat.getInstance(apiKey);

                await chatClientInstance.connectUser(
                    {
                        id: userId,
                        name: userName,
                        image: userImage,
                    },
                    token
                );
                if (cancelled) return;
                setChatClient(chatClientInstance);

                const chatChannel = chatClientInstance.channel("messaging", callId);
                await chatChannel.watch();
                if (cancelled) return;
                setChannel(chatChannel);
            } catch (error) {
                if (cancelled) return;
                toast.error("Failed to join video call");
                console.error("Error init call", error);
            } finally {
                if (!cancelled) setIsInitializingCall(false);
            }
        };

        if (!loadingSession) initCall();

        // cleanup - performance reasons
        return () => {
            cancelled = true;
            setCall(null);
            setChannel(null);
            setChatClient(null);
            setStreamClient(null);

            pendingCleanup = pendingCleanup.then(async () => {
                // each step separately, so one failure (e.g. leaving a call that never joined)
                // doesn't leave the other clients connected
                try {
                    if (videoCall) await videoCall.leave();
                } catch (error) {
                    console.error("Cleanup error (video call):", error);
                }
                try {
                    if (chatClientInstance) await chatClientInstance.disconnectUser();
                } catch (error) {
                    console.error("Cleanup error (chat):", error);
                }
                await disconnectStreamClient();
            });
        };
    }, [callId, sessionStatus, loadingSession, isHost, isParticipant]);

    return {
        streamClient,
        call,
        chatClient,
        channel,
        isInitializingCall,
    };
}

export default useStreamClient;
