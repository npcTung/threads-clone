import React, { memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  ScrollArea,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../ui";
import { Link } from "react-router-dom";
import { FollowerCount, UserAvatar } from "..";

const DialogFollowerFollowing = ({ open, onOpenChange, data }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle />
        <DialogDescription />
      </DialogHeader>
      <DialogContent className="max-h-[70%]">
        <Tabs defaultValue="follower">
          <TabsList className={"w-full flex gap-5"}>
            <TabsTrigger value="follower" className="flex-1">
              Người theo dõi
            </TabsTrigger>
            <TabsTrigger value="following" className="flex-1">
              Đang theo dõi
            </TabsTrigger>
          </TabsList>
          <ScrollArea className="w-full h-[80%]">
            <TabsContent value="follower">
              {data.follower.length > 0 ? (
                data.follower.map((follow) => (
                  <UserPreview key={follow._id} data={follow} />
                ))
              ) : (
                <span className="text-center w-full flex items-center justify-center p-5">
                  Không có người theo dõi
                </span>
              )}
            </TabsContent>
            <TabsContent value="following">
              {data.following.length > 0 ? (
                data.following.map((follow) => (
                  <UserPreview key={follow._id} data={follow} />
                ))
              ) : (
                <span className="text-center w-full flex items-center justify-center p-5">
                  Không theo dõi ai
                </span>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default memo(DialogFollowerFollowing);

const UserPreview = ({ data }) => {
  return (
    <div className={"w-full flex items-center justify-between p-5"}>
      <div className="flex gap-3 w-full">
        <div className="flex flex-col items-center">
          <Link to={`/${data.userName}`}>
            <UserAvatar avatarUrl={data.avatarUrl} />
          </Link>
        </div>
        <Link to={`/${data.userName}`} className="w-full">
          <div className="flex-1 w-full space-y-5 border-b pb-2">
            <div className="flex flex-col">
              <div className="flex justify-between w-full">
                <div className="flex w-full items-center">
                  <span className="text-sm font-medium hover:underline">
                    {data.userName}
                  </span>
                </div>
              </div>
              <span className="text-sm opacity-50">{data.displayName}</span>
            </div>
            <FollowerCount
              className={"text-sm"}
              follower={data.follower.length}
            />
          </div>
        </Link>
      </div>
    </div>
  );
};
