export function useNotifications() {
  const requestPermission = async () => {
    if (!("Notification" in window)) return;

    if (Notification.permission !== "granted") {
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        console.log("Notificações autorizadas");
      }
    }
  };

  const sendSystemNotification = async (title: string, body: string) => {
    if (Notification.permission === "granted") {
      const registration = await navigator.serviceWorker.ready;

      registration.showNotification(title, {
        body,
        icon: "/public/icon.svg",
        vibrate: [200, 100, 200],
        badge: "/public/icon.svg",
        tag: "task",
        renotify: true,
      } as NotificationOptions);
    }
  };

  return {
    requestPermission,
    sendSystemNotification,
  };
}
