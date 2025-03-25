import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// 你的 Firebase config
const firebaseConfig = {
  // ...
};
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// 當使用者點擊「允許通知」按鈕後，呼叫這個函式
async function requestPermissionAndGetToken() {
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    try {
      const currentToken = await getToken(messaging, {
        vapidKey: "oSdOyWkaU2j6WcyDrTQCMb6FovwpiOXO_bU_jyS92KQ"
      });
      if (currentToken) {
        console.log("取得推播 Token:", currentToken);
        // 這裡把 Token 傳給後端 (Apps Script / Server) 進行儲存
      } else {
        console.warn("無法取得 Token，可能使用者未允許或瀏覽器不支援。");
      }
    } catch (err) {
      console.error("取得 Token 發生錯誤:", err);
    }
  } else {
    console.warn("使用者未允許通知權限");
  }
}

// 監聽前景推播
onMessage(messaging, (payload) => {
  console.log("收到前景推播:", payload);
  // 可在此做彈窗或 UI 提示
});
