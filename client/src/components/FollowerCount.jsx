import { cn, formmatNumber } from "@/lib/utils";
import PropTypes from "prop-types";
import React from "react";

const FollowerCount = ({ className, follower, handelOnclick }) => {
  return (
    <span
      className={cn(
        "whitespace-nowrap cursor-pointer hover:underline transition-all",
        className
      )}
      onClick={handelOnclick}
    >
      {`${formmatNumber(follower)}
        người theo dõi`}
    </span>
  );
};

export default FollowerCount;

FollowerCount.prototype = {
  className: PropTypes.string,
  follower: PropTypes.number.isRequired,
};
