import { useCallback, useEffect, useState } from "react";
import OneSignal from "react-onesignal";
import { initOneSignal } from "../lib/oneSignal";

export function useNotifications() {
  const [initialized, setInitialized] = useState(false);
  const [permission, setPermission] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      await initOneSignal();

      if (!mounted) return;

      try {
        const isSupported = OneSignal.Notifications.isPushSupported();

        const hasPermission = OneSignal.Notifications.permission;

        const isSubscribed = OneSignal.User.PushSubscription.optedIn;

        setSupported(isSupported);
        setPermission(hasPermission);
        setSubscribed(isSubscribed || false);
        setInitialized(true);
      } catch (error) {
        console.error("Failed to read OneSignal state:", error);
      }
    };

    initialize();

    return () => {
      mounted = false;
    };
  }, []);

  const requestPermission = useCallback(async () => {
    try {
      if (!initialized) {
        await initOneSignal();
      }

      await OneSignal.Notifications.requestPermission();

      const hasPermission = OneSignal.Notifications.permission;

      const isSubscribed = OneSignal.User.PushSubscription.optedIn;

      setPermission(hasPermission);
      setSubscribed(isSubscribed || false);

      return hasPermission;
    } catch (error) {
      console.error("Failed to request notification permission:", error);

      return false;
    }
  }, [initialized]);

  const enableNotifications = useCallback(async () => {
    try {
      if (!initialized) {
        await initOneSignal();
      }

      await OneSignal.User.PushSubscription.optIn();

      setPermission(OneSignal.Notifications.permission);

      setSubscribed(OneSignal.User.PushSubscription.optedIn || false);

      return true;
    } catch (error) {
      console.error("Failed to enable notifications:", error);

      return false;
    }
  }, [initialized]);

  const disableNotifications = useCallback(async () => {
    try {
      await OneSignal.User.PushSubscription.optOut();

      setSubscribed(false);

      return true;
    } catch (error) {
      console.error("Failed to disable notifications:", error);

      return false;
    }
  }, []);

  return {
    initialized,
    supported,
    permission,
    subscribed,

    requestPermission,
    enableNotifications,
    disableNotifications,
  };
}
