// firebase.js

// 1. 從 Firebase SDK v9+ 匯入需要的函式
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

// 2. Firebase 專案設定
const firebaseConfig = {
  apiKey: "AIzaSyBqxtz3vhUgU4AdOhSD9nUh5kuI2FM1FCE",
  authDomain: "taiwan-bj.firebaseapp.com",
  projectId: "taiwan-bj",
  storageBucket: "taiwan-bj.firebasestorage.app",
  messagingSenderId: "330641090499",
  appId: "1:330641090499:web:0b2ecc8d71f9d5ffc33f76",
  measurementId: "G-S2MP6TQEV7"
};


// 3. 初始化 Firebase App
const app = initializeApp(firebaseConfig);

// 4. 取得 Messaging 實例
const messaging = getMessaging(app);

// 5. 匯出，讓其他檔案可以使用
export { app, messaging };
