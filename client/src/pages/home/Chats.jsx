import { Button, ChatSidebar, MessageInbox } from "@/components";
import InfoUser from "@/components/chats/InfoUser";
import icons from "@/lib/icons";
import { cn } from "@/lib/utils";
import useConversationStore from "@/zustand/useConversationStore";
import React from "react";

const { MessageCircle } = icons;

const Chats = () => {
  const { isInfoOpen, conversation } = useConversationStore();

  return (
    <div className="lg:h-screen xl:h-screen md:h-screen h-[89vh]">
      <div className="h-full rounded-md bg-muted shadow-md flex">
        <ChatSidebar
          className={cn(
            "hidden h-full flex-col lg:flex lg:w-1/4 xl:flex xl:w-1/4 bg-card border-r border-muted",
            conversation ? "hidden" : "block w-full"
          )}
        />
        {conversation ? (
          <>
            <MessageInbox
              className={cn(
                "flex h-full flex-col border-l border-muted bg-card lg:w-3/4 w-full",
                isInfoOpen ? "xl:w-1/2" : "xl:w-3/4"
              )}
            />
            {isInfoOpen && (
              <InfoUser
                className={
                  "hidden xl:flex h-full xl:flex-col border-l border-muted bg-card xl:w-1/4"
                }
              />
            )}
          </>
        ) : (
          <NoMessage />
        )}
      </div>
    </div>
  );
};

export default Chats;

const NoMessage = () => {
  const { isShowCreateConversation, setIsShowCreateConversation } =
    useConversationStore();
  return (
    <div className="hidden xl:flex lg:flex h-full flex-col space-y-5 items-center justify-center border-l border-muted bg-card xl:w-3/4 w-full">
      <div className="border-[3px] border-primary p-5 rounded-full w-fit">
        <MessageCircle className="size-14" />
      </div>
      <div className="flex flex-col items-center justify-center cursor-default">
        <span>Tin nhắn của bạn</span>
        <small>Gửi ảnh và tin nhắn riêng tư cho bạn bè hoặc nhóm</small>
      </div>
      <Button
        onClick={() => setIsShowCreateConversation(isShowCreateConversation)}
      >
        Gửi tin nhắn
      </Button>
    </div>
  );
};
