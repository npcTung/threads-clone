import React from "react";
import { Button } from "./ui";
import PropTypes from "prop-types";
import useCurrentStore from "@/zustand/useCurrentStore";

const FollowButton = ({ className, isFollow, userId }) => {
  const { followUser } = useCurrentStore();
  return (
    <Button
      variant={isFollow ? "outline" : "default"}
      className={className}
      onClick={() => followUser(userId)}
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
