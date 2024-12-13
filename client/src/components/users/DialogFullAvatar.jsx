import React, { memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui";
import { UserAvatar } from "..";

const DialogFullAvatar = ({ userData, open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="size-full flex items-center max-w-none justify-center bg-card/30 backdrop-blur-lg"
        onClick={onOpenChange}
      >
        <DialogHeader>
          <DialogTitle />
          <DialogDescription />
        </DialogHeader>
        <UserAvatar
          avatarUrl={userData?.avatarUrl}
          displayName={userData?.displayName}
          className="size-64"
        />
      </DialogContent>
    </Dialog>
  );
};

export default memo(DialogFullAvatar);
