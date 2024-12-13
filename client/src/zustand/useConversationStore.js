import { create } from "zustand";

const useConversationStore = create((set) => ({
  conversation: null,
  conversations: [],
  isShowCreateConversation: false,
  isInfoOpen: false,
  setConversation: (conversation) => set({ conversation }),
  setConversations: (conversations) => set({ conversations }),
  setIsShowCreateConversation: (isShowCreateConversation) =>
    set({ isShowCreateConversation: !isShowCreateConversation }),
  setIsInfoOpen: (isInfoOpen) => set({ isInfoOpen: !isInfoOpen }),
  clearConversation: () =>
    set({
      conversation: null,
      conversations: [],
      isShowCreateConversation: false,
      isInfoOpen: false,
    }),
}));

export default useConversationStore;
