"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { requestForToken, onMessageListener } from "@/lib/firebase";
import { useToast } from "@/components/ui/Toast";

export function NotificationInitializer() {
    const { user } = useAuth();
    const { toast } = useToast();

    useEffect(() => {
        if (user && process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
            // Request push token
            requestForToken();

            // Listen for foreground messages
            onMessageListener()
                .then((payload: any) => {
                    toast(payload.notification.body, "info");
                })
                .catch((err) => console.log("failed: ", err));
        }
    }, [user, toast]);

    return null;
}
