// main.js

// 若你要用 Firebase SDK v9+ (Modular)，可在此 import
// import { initializeApp } from "firebase/app";
// import { getMessaging, getToken } from "firebase/messaging";

// 你的後端 Apps Script URL
const API_URL = "https://script.google.com/macros/s/AKfycbx8zp4GGnZMeXZc_ORfWk2S8Dsbm33MZz2iLyv7XEkFBmsrIfKl2EhQyPKPdhAvyuG8/exec";

/** 顯示提示訊息 */
function showNotification(msg, isError = false) {
  const n = document.getElementById("notification");
  n.innerText = msg;
  n.className = "notification" + (isError ? " error" : "");
}

/** 登入函式 */
function login() {
  const name = document.getElementById("name").value.trim();
  const id = document.getElementById("id").value.trim();

  if (!name || !id) {
    showNotification("請填寫姓名與身分證", true);
    return;
  }

  // 呼叫後端 API 查詢員工名單
  fetch(API_URL, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: "findEmployeeById",
      data: { identity: id }
    })
  })
  .then(response => response.json())
  .then(result => {
    if (result.success) {
      const emp = result.data;
      // 可選擇比對「姓名」是否一致
      if (emp['姓名'] !== name) {
        showNotification("姓名與身份證不匹配", true);
        return;
      }
      // 儲存登入資訊到 localStorage
      localStorage.setItem("employee", JSON.stringify(emp));
      showNotification("登入成功！");
      setTimeout(() => { window.location.href = "main.html"; }, 1000);
    } else {
      // 後端若回傳 { success: false, message: "xxx" }
      showNotification(result.message, true);
    }
  })
  .catch(err => {
    showNotification("系統錯誤：" + err, true);
  });
}

/** 按下「允許通知並取得 Token」的動作 (範例) */
function requestPermissionAndGetToken() {
  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      showNotification("使用者已允許通知");
      // TODO: 在這裡若要取得 FCM Token，可再加:
       getToken(messaging, { vapidKey: "BPFDf-IEHaHbdPhNjCVbIlVL0MqMBUWgagMW-glQg6TDj_3h3CcKe9nyL4slUhD5Wi2cD35_6BpgCX4mL9sAK5M" }).then(...)
    } else {
      showNotification("使用者未允許通知", true);
    }
  });
}

/** 按下「允許通知」的示範 (僅本地通知) */
function askNotificationPermission() {
  Notification.requestPermission().then(permission => {
    console.log("使用者選擇:", permission);
  });
}

/** 等待 DOM 讀取完再綁定按鈕事件 */
window.addEventListener("DOMContentLoaded", () => {
  // 綁定「登入」按鈕
  document.getElementById("loginBtn").addEventListener("click", login);
  // 綁定「新人資料登錄」按鈕
  document.getElementById("newRegisterBtn").addEventListener("click", () => {
    window.location.href = "new_register.html";
  });
  // 綁定「允許通知並取得 Token」按鈕
  document.getElementById("getTokenBtn").addEventListener("click", requestPermissionAndGetToken);
  // 綁定「允許通知」按鈕
  document.getElementById("askNotificationBtn").addEventListener("click", askNotificationPermission);
});
