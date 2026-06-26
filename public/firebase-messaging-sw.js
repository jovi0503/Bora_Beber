
// /public/firebase-messaging-sw.js

// Import the Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js');

// A configuração do Firebase é colocada diretamente aqui como texto.
// Estes valores são públicos e seguros para serem expostos no cliente.
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "bora-delivery-xfzo8",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize the Firebase app in the service worker
try {
    firebase.initializeApp(firebaseConfig);

    // Retrieve an instance of Firebase Messaging so that it can handle background messages.
    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
        console.log('[firebase-messaging-sw.js] Received background message ', payload);
        
        const notificationTitle = payload.notification.title;
        const notificationOptions = {
            body: payload.notification.body,
            icon: payload.notification.icon || '/images/logo-192x192.png'
        };

        self.registration.showNotification(notificationTitle, notificationOptions);
    });

} catch (error) {
    console.error("Erro ao inicializar Firebase no Service Worker:", error);
}
