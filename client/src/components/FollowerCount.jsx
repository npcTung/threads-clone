import { cn, formmatNumber } from "@/lib/utils";
import { faker } from "@faker-js/faker";
import React from "react";

const FollowerCount = ({ className }) => {
  return (
    <span className={cn("whitespace-nowrap", className)}>
      {`${formmatNumber(
        faker.number.int({ min: 10, max: 999999999 }).toString()
      )}
        người theo dõi`}
    </span>
  );
};

export default FollowerCount;
