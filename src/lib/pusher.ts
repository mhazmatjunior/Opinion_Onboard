import PusherServer from 'pusher';
import PusherClient from 'pusher-js';

// Server-side Pusher (for triggering events)
export const pusherServer = new PusherServer({
    appId: process.env.PUSHER_APP_ID || "placeholder",
    key: process.env.NEXT_PUBLIC_PUSHER_KEY || "placeholder",
    secret: process.env.PUSHER_SECRET || "placeholder",
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "placeholder",
    useTLS: true,
});

// Client-side Pusher (for listening to events)
export const pusherClient = new PusherClient(
    process.env.NEXT_PUBLIC_PUSHER_KEY || "placeholder",
    {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "placeholder",
    }
);
