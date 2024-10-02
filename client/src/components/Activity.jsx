import React, { useEffect, useState } from "react";
import { Button } from "./ui";
import { Link } from "react-router-dom";
import path from "@/lib/path";
import icons from "@/lib/icons";
import { cn } from "@/lib/utils";
import useActivitiesStore from "@/zustand/useActivitiesStore";

const { Heart } = icons;

const Activity = ({ pathName }) => {
  const { unreadCount, fetchUnreadCount } = useActivitiesStore();

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  return (
    <Button
      variant={"ghost"}
      className="flex items-center justify-start"
      asChild
    >
      <Link to={`/${path.ACTIVITY}`}>
        <div className="relative">
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
