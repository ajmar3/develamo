import { useEffect } from "react";
import { useFeedbackStore } from "../stores/feedback.store";
import { XMarkIcon } from "@heroicons/react/24/outline";

export const FeedbackMessages = () => {
  const messages = useFeedbackStore((state) => state.mesages);
  const removeMessage = useFeedbackStore((state) => state.removeMessage);

  return (
    <div className="absolute top-16 right-10 w-96 flex flex-col gap-2">
      {messages.map((message) => {
        if (message.statusCode >= 200 && message.statusCode < 300)
          return (
            <div
              className="w-full rounded-md bg-success text-sucess-content"
              key={message.id}
            >
              <div className="w-full px-4 py-2 text-lg font-semibold border-b border-success-content flex justify-between items-center">
                {message.error}
                <XMarkIcon
                  className="w-7 h-7 cursor-pointer"
                  onClick={() => removeMessage(message.id)}
                />
              </div>
              <div className="w-full px-4 py-2 ">{message.message}</div>
            </div>
          );
        else if (message.statusCode >= 400 && message.statusCode < 499)
          return (
            <div
              className="w-full rounded-md bg-error text-error-content"
              key={message.id}
            >
              <div className="w-full px-4 py-2 text-lg font-semibold border-b border-error-content flex justify-between items-center">
                {message.error}
                <XMarkIcon
                  className="w-7 h-7 cursor-pointer"
                  onClick={() => removeMessage(message.id)}
                />
              </div>
              <div className="w-full px-4 py-2 ">{message.message}</div>
            </div>
          );
        else
          return (
            <div className="w-full rounded-md bg-error text-error-content">
              <div className="w-full px-4 py-2 text-lg font-semibold border-b border-error-content flex justify-between items-center">
                {message.error}
                <XMarkIcon
                  className="w-7 h-7 cursor-pointer"
                  onClick={() => removeMessage(message.id)}
                />
              </div>
              <div className="w-full px-4 py-2 ">
                Something went wrong on our end please try again later!
              </div>
            </div>
          );
      })}
    </div>
  );
};
