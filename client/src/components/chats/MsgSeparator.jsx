import React from "react";
import { Divider } from "..";
import { formatDate } from "date-fns";

const MsgSeparator = ({ date }) => {
  return (
    <div className="flex flex-row items-center space-x-5 w-full py-2">
      <Divider className={"grow"} />
      <div className="p-1 bg-muted rounded-md text-xs font-medium">
        {formatDate(date, "HH:mm")}
      </div>
      <Divider className={"grow"} />
    </div>
  );
};

export default MsgSeparator;
