// main.js

export const API_URL = "https://script.google.com/macros/s/AKfycbx8zp4GGnZMeXZc_ORfWk2S8Dsbm33MZz2iLyv7XEkFBmsrIfKl2EhQyPKPdhAvyuG8/exec"; 
// ↑ 請替換成你部署好的 Apps Script URL

/**
 * 顯示提示訊息
 */
export function showNotification(msg, isError = false) {
  const n = document.getElementById("notification");
  if (n) {
    n.innerText = msg;
    n.className = "notification" + (isError ? " error" : "");
  } else {
    alert(msg);
  }
}

/**
 * 登入流程
 */
function login() {
  const name = document.getElementById("name").value.trim();
  const id = document.getElementById("id").value.trim();
  if (!name || !id) {
    showNotification("請填寫姓名與身分證", true);
    return;
  }
  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "findEmployeeById",
      data: { identity: id }
    })
  })
  .then(r => r.json())
  .then(result => {
    if (result.success) {
      const emp = result.data;
      if (emp['姓名'] !== name) {
        showNotification("姓名與身份證不匹配", true);
        return;
      }
      localStorage.setItem("employee", JSON.stringify(emp));
      showNotification("登入成功！");
      setTimeout(() => { window.location.href = "main.html"; }, 800);
    } else {
      showNotification(result.message, true);
    }
  })
  .catch(err => {
    showNotification("系統錯誤：" + err, true);
  });
}

/**
 * 新人資料登錄
 */
export function registerNewEmployee(data) {
  if (!data['姓名'] || !data['身份證']) {
    showNotification("姓名與身份證必填", true);
    return;
  }
  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "writeNewEmployee",
      data
    })
  })
  .then(r => r.json())
  .then(result => {
    if (result.success) {
      showNotification("登錄成功！");
      setTimeout(() => { window.location.href = "index.html"; }, 800);
    } else {
      showNotification(result.message, true);
    }
  })
  .catch(err => showNotification("系統錯誤：" + err, true));
}

/**
 * 允許通知並取得 Token (前端)
 * 這裡只是本地通知示範，若要 FCM token, 需整合 firebase.js
 */
function requestPermissionAndGetToken() {
  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      showNotification("已允許通知");
      // 調用 getToken(messaging, { vapidKey: "..." })
      getToken(messaging, { vapidKey: "BPFDf-IEHaHbdPhNjCVbIlVL0MqMBUWgagMW-glQg6TDj_3h3CcKe9nyL4slUhD5Wi2cD35_6BpgCX4mL9sAK5M" })
        .then((currentToken) => {
          if (currentToken) {
            console.log("取得推播 Token:", currentToken);
            // 你可以把 Token 上傳到後端
          } else {
            console.warn("無法取得 Token，使用者可能未允許通知。");
          }
        })
        .catch((err) => {
          console.error("取得 Token 發生錯誤:", err);
        });
    } else {
      showNotification("使用者未允許通知", true);
    }
  });
}

/**
 * 初始化 index.html
 */
function initIndexPage() {
  const loginBtn = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtn");
  const getTokenBtn = document.getElementById("getTokenBtn");
  if (loginBtn) loginBtn.addEventListener("click", login);
  if (registerBtn) registerBtn.addEventListener("click", () => {
    window.location.href = "new_register.html";
  });
  if (getTokenBtn) getTokenBtn.addEventListener("click", requestPermissionAndGetToken);
}

/**
 * 初始化 main.html
 */
export function initMainPage() {
  const empStr = localStorage.getItem("employee");
  if (!empStr) {
    showNotification("尚未登入，請先登入。", true);
    setTimeout(() => { window.location.href = "index.html"; }, 1000);
    return;
  }
  const emp = JSON.parse(empStr);
  const welcome = document.getElementById("welcome");
  if (welcome) welcome.innerText = `歡迎你，${emp['姓名']}！`;

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("employee");
    window.location.href = "index.html";
  });
}

/** 自動依照頁面執行對應 init */
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;
  if (path.endsWith("index.html")) {
    initIndexPage();
  }
  // 你也可判斷 path.endsWith("main.html") 就呼叫 initMainPage();
});

// Service Worker 註冊
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log("Service Worker registered."))
    .catch(err => console.error("Service Worker register error:", err));
}