import create from "zustand";

export type FeedbackMessageReturnType = {
  message: string;
  statusCode: number;
  error: string;
};

export type FeedbackMessageType = {
  id: string;
  message: string;
  statusCode: number;
  error: string;
};

export interface IFeedbackStore {
  mesages: FeedbackMessageType[];
  setMessages: (messages: FeedbackMessageType[]) => void;
  addMessage: (message: FeedbackMessageReturnType) => void;
  removeMessage: (messageId: string) => void;
}

export const useFeedbackStore = create<IFeedbackStore>((set) => {
  return {
    mesages: [],
    setMessages: (messages: FeedbackMessageType[]) =>
      set((state) => ({ mesages: messages })),
    addMessage: (message: FeedbackMessageReturnType) =>
      set((state) => {
        const current = JSON.parse(JSON.stringify(state.mesages));
        const newId = (Math.random() + 1).toString(36).substring(7);
        current.push({
          id: newId,
          message: message.message,
          statusCode: message.statusCode,
          error: message.error,
        });
        return { mesages: current };
      }),
    removeMessage: (messageId: string) =>
      set((state) => {
        const current = JSON.parse(JSON.stringify(state.mesages));
        const filtered = current.filter(
          (x: FeedbackMessageType) => x.id != messageId
        );
        return { mesages: filtered };
      }),
  };
});
