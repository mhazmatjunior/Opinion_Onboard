import admin from 'firebase-admin';

if (!admin.apps.length) {
    try {
        const serviceAccount = JSON.parse(
            process.env.FIREBASE_SERVICE_ACCOUNT || '{}'
        );

        if (serviceAccount.project_id) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
            console.log("Firebase Admin initialized successfully");
        } else {
            console.warn("FIREBASE_SERVICE_ACCOUNT is missing or invalid. Push notifications will be disabled.");
        }
    } catch (error) {
        console.error("Error initializing Firebase Admin:", error);
    }
}

export const messaging = admin.apps.length ? admin.messaging() : null;
