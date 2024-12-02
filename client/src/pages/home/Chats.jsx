import { ChatSidebar, MessageInbox } from "@/components";
import InfoUser from "@/components/chats/InfoUser";
import { cn } from "@/lib/utils";
import useAppStore from "@/zustand/useAppStore";
import React from "react";

const Chats = () => {
  const { isInfoOpen } = useAppStore();

  return (
    <div className="h-screen">
      <div className="h-full rounded-md bg-muted shadow-md flex">
        <ChatSidebar
          className={
            "hidden h-full flex-col xl:flex xl:w-1/4 bg-card border-r border-muted"
          }
        />
        <MessageInbox
          className={cn(
            "flex h-full flex-col border-l border-muted bg-card",
            isInfoOpen ? "xl:w-1/2" : "xl:w-3/4"
          )}
        />
        {isInfoOpen && (
          <InfoUser
            className={
              "flex h-full flex-col border-l border-muted bg-card xl:w-1/4"
            }
          />
        )}
      </div>
    </div>
  );
};

export default Chats;
