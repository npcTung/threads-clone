import React from "react";
import logoIcon from "@/assets/darkLogo.svg";
import { Link } from "react-router-dom";

const Activity = () => {
  return (
    <div className="w-[720px] mx-auto mb-10 p-5 border space-y-5 lg:rounded-2xl bg-card">
      <ActivityPrewiews />
    </div>
  );
};

export default Activity;

const activities = [
  { _id: 1, type: "Followed", userName: "John Doe" },
  { _id: 2, type: "Commented on", userName: "Jane Smith" },
  { _id: 3, type: "Liked your post", userName: "Mike Johnson" },
  { _id: 4, type: "Shared your post", userName: "Sarah Davis" },
  { _id: 5, type: "Mentioned you in a post", userName: "Emily Brown" },
];

const ActivityPrewiews = () => {
  return (
    <div>
      {activities?.length &&
        activities.map((data) => (
          <ActivityPrewiew key={data._id} data={data} />
        ))}
    </div>
  );
};

const ActivityPrewiew = ({ data }) => {
  return (
    <div className={"w-full flex items-center justify-between p-5"}>
      <div className="flex gap-3 w-full">
        <div className="flex flex-col items-center">
          <Link to={`#`} className="p-2 bg-black rounded-full size-10">
            <img
              src={logoIcon}
              alt="Logo icon"
              className="size-full overflow-hidden"
            />
          </Link>
        </div>
        <Link to={`#`} className="w-full">
          <div className="flex-1 w-full space-y-5 border-b pb-2">
            <div className="flex flex-col">
              <div className="flex justify-between w-full">
                <div className="flex w-full items-center">
                  {/* <UserTooltip user={data}> */}
                  <span className="text-sm font-medium hover:underline">
                    {data.userName}
                  </span>
                  {/* </UserTooltip> */}
                </div>
              </div>
              <span className="text-sm opacity-50">{data.type}</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};
