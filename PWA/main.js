// main.js

import { messaging } from './firebase.js';
import { getToken } from 'firebase/messaging';

// 1. 請求通知權限並取得 FCM Token
async function requestPermissionAndGetToken() {
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    try {
      // 這裡帶入你的 VAPID 公鑰
      const currentToken = await getToken(messaging, { vapidKey: "BPFDf-IEHaHbdPhNjCVbIlVL0MqMBUWgagMW-glQg6TDj_3h3CcKe9nyL4slUhD5Wi2cD35_6BpgCX4mL9sAK5M" });
      if (currentToken) {
        console.log("取得推播 Token:", currentToken);
        // 你可以把 Token 傳給後端 (Apps Script / Server) 儲存
      } else {
        console.warn("無法取得 Token，使用者可能未允許通知或瀏覽器不支援。");
      }
    } catch (err) {
      console.error("取得 Token 發生錯誤:", err);
    }
  } else {
    console.warn("使用者拒絕通知權限");
  }
}

// 2. 讓按鈕可以呼叫這個函式
window.requestPermissionAndGetToken = requestPermissionAndGetToken;

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('firebase-messaging-sw.js')
    .then((registration) => {
      console.log('FCM Service Worker 註冊成功:', registration);
    })
    .catch((err) => {
      console.error('FCM Service Worker 註冊失敗:', err);
    });
}

