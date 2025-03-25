// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.17.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.17.2/firebase-messaging-compat.js');

// 初始化 Firebase (同你的 firebaseConfig)
firebase.initializeApp({
  apiKey: "AIzaSyBqxtz3vhUgU4AdOhSD9nUh5kuI2FM1FCE",
  authDomain: "taiwan-bj.firebaseapp.com",
  projectId: "taiwan-bj",
  storageBucket: "taiwan-bj.firebasestorage.app",
  messagingSenderId: "330641090499",
  appId: "1:330641090499:web:0b2ecc8d71f9d5ffc33f76",
  measurementId: "G-S2MP6TQEV7"
};

const messaging = firebase.messaging();

// 背景推播
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] 背景推播:', payload);
  const notificationTitle = payload.notification.title || '背景推播';
  const notificationOptions = {
    body: payload.notification.body || '推播內容',
    icon: '/icon.png'
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
