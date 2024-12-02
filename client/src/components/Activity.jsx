import React, { useEffect } from "react";
import { Button } from "./ui";
import { Link } from "react-router-dom";
import path from "@/lib/path";
import icons from "@/lib/icons";
import { cn } from "@/lib/utils";
import useAppStore from "@/zustand/useAppStore";
import { useQuery } from "@tanstack/react-query";
import * as apis from "@/apis";

const { Heart } = icons;

const markAsRead = async () => {
  try {
    await apis.markAsRead();
  } catch (error) {
    console.error(error.message);
  }
};

const fetchUnreadCount = async () => {
  try {
    const response = await apis.unreadCount();
    if (response.success) return response.unreadCount;
  } catch (error) {
    console.error(error.message);
  }
};

const Activity = ({ pathName }) => {
  const { unreadCount, setUnreadCount } = useAppStore();

  const { data } = useQuery({
    queryKey: ["activities", "unread_count"],
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
            markAsRead();
            setUnreadCount(0);
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
