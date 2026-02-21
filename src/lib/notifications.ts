import { db } from "@/db";
import { notifications, pushSubscriptions } from "@/db/schema";
import { pusherServer } from "./pusher";
import { messaging } from "./firebase-admin";
import { eq } from "drizzle-orm";

interface NotificationTrigger {
    userId: string;
    type: 'new_opinion' | 'reply' | 'upvote';
    content: string;
    link: string;
}

export async function triggerNotification({ userId, type, content, link }: NotificationTrigger) {
    try {
        // 1. Save to Database
        const [newNotif] = await db.insert(notifications).values({
            userId,
            type,
            content,
            link,
            isRead: false,
        }).returning();

        // 2. Broadcast via Pusher for real-time update
        await pusherServer.trigger(`user-${userId}`, "new-notification", {
            ...newNotif,
            createdAt: newNotif.createdAt.toISOString(),
        });

        // 3. Trigger Push Notification via FCM
        if (messaging) {
            try {
                const sub = await db.query.pushSubscriptions.findFirst({
                    where: eq(pushSubscriptions.userId, userId),
                });

                if (sub && sub.subscription) {
                    await messaging.send({
                        token: sub.subscription,
                        notification: {
                            title: type === 'reply' ? 'New Reply!' : type === 'upvote' ? 'New Upvote!' : 'New Opinion!',
                            body: content,
                        },
                        data: {
                            link, // This can be used by the client to navigate
                        },
                        webpush: {
                            notification: {
                                icon: '/icon.svg',
                                clickAction: link, // Direct link to the incident
                            },
                        },
                    });
                    console.log(`Push notification sent to user ${userId}`);
                }
            } catch (fcmError) {
                console.error("Failed to send FCM message:", fcmError);
            }
        }

        return newNotif;
    } catch (error) {
        console.error("Error triggering notification:", error);
    }
}
