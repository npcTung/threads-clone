import React from "react";
import { Button } from "./ui";
import PropTypes from "prop-types";
import { useFollowUser } from "@/hooks/useCurrentData";

const FollowButton = ({ className, isFollow, userId }) => {
  const followButton = useFollowUser();

  return (
    <Button
      variant={isFollow ? "outline" : "default"}
      className={className}
      onClick={() => followButton.followUser(userId)}
    >
      {isFollow ? "Đang theo dõi" : "Theo dõi"}
    </Button>
  );
};

export default FollowButton;

FollowButton.prototype = {
  className: PropTypes.string,
  isFollow: PropTypes.bool.isRequired,
};
