import React, { useState } from "react";
import avatarPlaceholder from "@/assets/avatar-placeholder.png";
import { cn } from "@/lib/utils";
import PropTypes from "prop-types";

const UserAvatar = ({
  avatarUrl,
  displayName = "CN",
  size,
  className,
  handelOnclick,
}) => {
  const [imageUrl, setImageUrl] = useState(avatarUrl || avatarPlaceholder);

  return (
    <img
      src={imageUrl}
      alt={displayName}
      width={size ?? 48}
      height={size ?? 48}
      onError={() => setImageUrl(avatarPlaceholder)}
      className={cn(
        "aspect-square h-fit flex-none rounded-full bg-secondary object-cover",
        className
      )}
      onClick={(e) => {
        e.stopPropagation();
        handelOnclick && handelOnclick();
      }}
    />
  );
};

export default UserAvatar;

UserAvatar.prototype = {
  avatarUrl: PropTypes.string,
  displayName: PropTypes.string,
  size: PropTypes.number,
  className: PropTypes.string,
  handelOnclick: PropTypes.func,
};
