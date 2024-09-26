import React, { useEffect, useState } from "react";
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
  const [imageUrl, setImageUrl] = useState();

  useEffect(() => {
    setImageUrl(avatarUrl || avatarPlaceholder);
  }, [avatarUrl]);

  return (
    <img
      src={imageUrl}
      alt={displayName}
      width={size ?? 48}
      height={size ?? 48}
      onError={() => setImageUrl(imageUrl)}
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
