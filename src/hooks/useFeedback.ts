import { useState } from "react";

type FeedbackType = "error" | "warning" | "success" | "info";

interface Feedback {
  open: boolean;
  title: string;
  message: string;
  type: FeedbackType;
}

export function useFeedback() {
  const [feedback, setFeedback] = useState<Feedback>({
    open: false,
    title: "",
    message: "",
    type: "info",
  });

  const showFeedback = (
    title: string,
    message: string,
    type: FeedbackType = "info",
  ) => {
    setFeedback({
      open: true,
      title,
      message,
      type,
    });
  };

  const hideFeedback = () => {
    setFeedback((prev) => ({
      ...prev,
      open: false,
    }));
  };

  return {
    feedback,
    showFeedback,
    hideFeedback,
  };
}
