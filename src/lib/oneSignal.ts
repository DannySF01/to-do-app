import OneSignal from "react-onesignal";

const APP_ID = import.meta.env.VITE_ONESIGNAL_APP_ID;

let initializationPromise: Promise<void> | null = null;

export function initOneSignal(): Promise<void> {
  if (initializationPromise) {
    return initializationPromise;
  }

  if (!APP_ID) {
    console.warn("OneSignal App ID is missing.");
    return Promise.resolve();
  }

  initializationPromise = OneSignal.init({
    appId: APP_ID,

    serviceWorkerPath: "/onesignal/OneSignalSDKWorker.js",

    serviceWorkerParam: {
      scope: "/onesignal/",
    },

    allowLocalhostAsSecureOrigin: true,
  })
    .then(() => {
      console.log("OneSignal initialized");
    })
    .catch((error) => {
      console.error("Failed to initialize OneSignal:", error);

      // Allow another attempt if initialization actually failed.
      initializationPromise = null;

      throw error;
    });

  return initializationPromise;
}
