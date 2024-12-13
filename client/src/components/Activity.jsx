import React, { useEffect } from "react";
import { Button } from "./ui";
import { Link } from "react-router-dom";
import path from "@/lib/path";
import icons from "@/lib/icons";
import { cn } from "@/lib/utils";
import useAppStore from "@/zustand/useAppStore";
import useConversationStore from "@/zustand/useConversationStore";
import { useQuery } from "@tanstack/react-query";
import * as apis from "@/apis";
import useCurrentStore from "@/zustand/useCurrentStore";

const { Heart } = icons;

const markAsRead = async () => {
  try {
    await apis.markAsRead();
  } catch (error) {
    console.error(error.message);
  }
};

const fetchUnreadCount = async () => {
  const { isLoggedIn } = useCurrentStore();

  try {
    if (isLoggedIn) {
      const response = await apis.unreadCount();
      if (response.success) return response.unreadCount;
    }
  } catch (error) {
    console.error(error.message);
  }
};

const Activity = ({ pathName }) => {
  const { unreadCount, setUnreadCount } = useAppStore();
  const { setConversation, conversation } = useConversationStore();
  const queryKey = ["activities", "unread_count"];

  const { data } = useQuery({
    queryKey: queryKey,
    queryFn: fetchUnreadCount,
    staleTime: 5000,
  });

  useEffect(() => {
    if (data) setUnreadCount(data);
  }, [data]);

  return (
    <Button
      variant={"ghost"}
      className="flex items-center justify-start"
      asChild
    >
      <Link to={`/${path.ACTIVITY}`}>
        <div
          className="relative"
          onClick={() => {
            unreadCount > 0 && (markAsRead(), setUnreadCount(0));
            conversation && setConversation(null);
          }}
        >
          <Heart
            className={cn(
              "opacity-50 hover:opacity-100 transition-all",
              pathName === "/activity" && "opacity-100"
            )}
          />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 rounded-full bg-red-600 px-1 text-xs font-medium tabular-nums text-white">
              {unreadCount > 50 ? `+50` : unreadCount}
            </span>
          )}
        </div>
      </Link>
    </Button>
  );
};

export default Activity;
