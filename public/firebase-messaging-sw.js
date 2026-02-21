// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Full configuration for better production reliability
// (Values match the current opinion-onboard-ed09c project)
firebase.initializeApp({
    apiKey: "AIzaSyANJTUdjX6td2G6WcNoixLtuYxOUFqR81I",
    authDomain: "opinion-onboard-ed09c.firebaseapp.com",
    projectId: "opinion-onboard-ed09c",
    storageBucket: "opinion-onboard-ed09c.firebasestorage.app",
    messagingSenderId: "743966584313",
    appId: "1:743966584313:web:4e29cb70b45795cef0a128"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    const notificationTitle = payload.notification?.title || 'Opinion Onboard';
    const notificationOptions = {
        body: payload.notification?.body || 'New notification received!',
        icon: '/next.svg', // Fallback to next.svg if icon.svg is missing
        data: {
            url: payload.data?.link || '/'
        }
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click to open the link
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const urlToOpen = event.notification.data.url;

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            // If a tab is already open, focus it and navigate
            for (const client of windowClients) {
                if (client.url === urlToOpen && 'focus' in client) {
                    return client.focus();
                }
            }
            // Otherwise, open a new window
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});
