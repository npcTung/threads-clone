import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui";
import { FollowButton, FollowerCount, UserAvatar } from ".";
import femaleIcon from "@/assets/female-icon.svg";
import maleIcon from "@/assets/male-icon.svg";
import { formmatNumber } from "@/lib/utils";
import { Link } from "react-router-dom";
import icons from "@/lib/icons";

const { Dot } = icons;

const UserTooltip = ({ children, user }) => {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className="space-y-5">
          <div className="flex min-w-60 max-w-80 flex-col gap-3 break-words px-1 py-2.5 md:min-w-52">
            <div className="flex items-center justify-between gap-20">
              <Link to={`/${user.userName}`}>
                <span className="text-lg font-semibold hover:underline">
                  {user.displayName}
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  @{user.userName}{" "}
                  {user.gender === "female" && (
                    <img
                      src={femaleIcon}
                      alt={`${user.gender} icon`}
                      className="size-4"
                    />
                  )}
                  {user.gender === "male" && (
                    <img
                      src={maleIcon}
                      alt={`${user.gender} icon`}
                      className="size-4"
                    />
                  )}
                </span>
              </Link>
              <Link to={`/${user.userName}`} className="size-[70px]">
                <UserAvatar
                  avatarUrl={user.avatarUrl}
                  size={70}
                  displayName={user.displayName}
                />
              </Link>
            </div>
            {user.bio && (
              <div className="line-clamp-4 whitespace-pre-line">{user.bio}</div>
            )}
          </div>
          <div className="flex items-center opacity-50">
            <span>
              {`${formmatNumber(user.posts.toString())}
              bài viết`}
            </span>
            <Dot />
            <FollowerCount
            // userId={user.id}
            // initialState={followerState}
            />
          </div>
          {/* {loggedInUser.id !== user.id && ( */}
          <FollowButton
            className={"w-full"}
            // userId={user.id}
            // initialState={followerState}
          />
          {/* )} */}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default UserTooltip;
