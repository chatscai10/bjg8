// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.17.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.17.2/firebase-messaging-compat.js');

// 初始化 Firebase
firebase.initializeApp({
  // 同你的 firebaseConfig
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  messagingSenderId: "...",
  appId: "..."
});

// 取得 Messaging 實例
const messaging = firebase.messaging();

// 背景推播
messaging.onBackgroundMessage((payload) => {
  console.log("[SW] 背景推播:", payload);
  const notificationTitle = payload.notification.title || "背景推播";
  const notificationOptions = {
    body: payload.notification.body || "這是背景推播內容",
    icon: "/icon.png"
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
