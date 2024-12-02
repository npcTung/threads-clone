import React from "react";
import { cn } from "@/lib/utils";
import PropTypes from "prop-types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui";

const UserAvatar = ({
  avatarUrl,
  displayName = "CN",
  className,
  handelOnclick,
  isOnline,
}) => {
  return (
    <div className="relative inline-block w-fit">
      <Avatar
        className={cn(className)}
        onClick={(e) => {
          e.stopPropagation();
          handelOnclick && handelOnclick();
        }}
      >
        <AvatarImage src={avatarUrl} alt={displayName} />
        <AvatarFallback>
          {displayName
            .split(/[\s.\W]+/)
            .map((part) => part[0])
            .join("")}
        </AvatarFallback>
      </Avatar>
      {isOnline && (
        <span
          className="absolute bottom-0 right-1 size-3 bg-green-500 border border-white rounded-full"
          title="Online"
        />
      )}
    </div>
  );
};

export default UserAvatar;

UserAvatar.prototype = {
  avatarUrl: PropTypes.string,
  displayName: PropTypes.string,
  size: PropTypes.number,
  className: PropTypes.string,
  handelOnclick: PropTypes.func,
  isOnline: PropTypes.bool,
};
