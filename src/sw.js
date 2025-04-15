try {
  // Firebase
  importScripts("https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js");
  importScripts("https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js");

  firebase.initializeApp({
    apiKey: "AIzaSyDuLA2aurtl5by8b3SOKINM1QEHuRij54M",
    authDomain: "swings-fcm.firebaseapp.com",
    projectId: "swings-fcm",
    messagingSenderId: "663931459699",
    appId: "1:663931459699:web:fffd543477937225aef206",
  });

  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    const title = payload?.notification?.title || "새 알림";
    const options = {
      body: payload?.notification?.body || "내용을 확인하세요",
      icon: "/swings/pwa-192x192.png",
    };

    self.registration.showNotification(title, options);
  });
} catch (err) {
  console.error("🔥 FCM 초기화 또는 메시징 오류:", err);
}

self.addEventListener("push", function (event) {
  const data = event.data?.json();
  const title = data?.notification?.title || "📢 새로운 알림";
  const options = {
    body: data?.notification?.body || "",
    icon: "/swings/pwa-192x192.png",
    badge: "/swings/pwa-192x192.png",
  };
  event.waitUntil(
      self.registration.showNotification(title, options)
  );
});

try {
  // Workbox - 캐시 기능
  importScripts("https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-core.min.js");
  importScripts("https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-precaching.min.js");
  importScripts("https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-routing.min.js");

  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);
} catch (err) {
  console.error("🔥 Workbox import 또는 precache 실패:", err);
}