import { cn, formatRelativeDate } from "@/lib/utils";
import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui";
import icons from "@/lib/icons";
import useCurrentStore from "@/zustand/useCurrentStore";
import { LoadingButton, UserAvatar } from "..";
import { toast } from "sonner";
import useConversationStore from "@/zustand/useConversationStore";

const { X, Clock3, UserX, Trash2 } = icons;

const InfoUser = ({ className }) => {
  const { conversation } = useConversationStore();
  return (
    <div className={cn(className)}>
      {/* Info header */}
      <InfoHeader
        className={
          "sticky border-b border-muted flex flex-row items-center justify-between w-full px-6 py-[22.5px]"
        }
      />
      {/* Info body */}
      <InfoBody className={"max-h-full grow"} data={conversation} />
      {/* Info footer */}
      <InfoFooter
        className={"sticky bottom-0 border-t border-muted px-6 py-5"}
      />
    </div>
  );
};

export default InfoUser;

const InfoHeader = ({ className }) => {
  const { isInfoOpen, setIsInfoOpen } = useConversationStore();

  return (
    <div className={cn(className)}>
      <div className="text-primary font-semibold text-lg cursor-default">
        Thông tin người dùng
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsInfoOpen(isInfoOpen)}
      >
        <X className="size-5" />
      </Button>
    </div>
  );
};

const InfoBody = ({ className, data }) => {
  const { currentData } = useCurrentStore();
  const userConversation = data.participants.find(
    (el) => el._id !== currentData._id
  );

  return (
    <div className={cn(className)}>
      <div className="flex justify-center my-8">
        <UserAvatar
          avatarUrl={userConversation.avatarUrl}
          displayName={userConversation.displayName}
          className={"size-32"}
        />
      </div>
      <div className="px-6 space-y-1 flex flex-col">
        <span className="text-lg font-medium">
          {userConversation.displayName}
        </span>
        <span className="text-sm line-clamp-2 whitespace-pre-line opacity-50">
          {userConversation.bio}
        </span>
      </div>
      <div className="px-6 my-6">
        <div className="flex flex-row items-center space-x-2">
          <Clock3 className="size-5 opacity-50" />
          <span
            className={cn(
              "font-medium",
              userConversation.status === "Online"
                ? "text-green-600"
                : "opacity-50"
            )}
          >
            {userConversation.status === "Online"
              ? "Đang hoạt động"
              : userConversation.status_expiry_time
              ? formatRelativeDate(userConversation.status_expiry_time)
              : "Offline"}
          </span>
        </div>
      </div>
    </div>
  );
};

const InfoFooter = ({ className }) => {
  const [isShowBlockUser, setIsShowBlockUser] = useState(false);
  const [isShowDeleteConversation, setIsShowDeleteConversation] =
    useState(false);

  return (
    <div className={cn(className)}>
      <DialogBlockAndDeleteConversation
        block
        open={isShowBlockUser}
        onOpenChange={setIsShowBlockUser}
      />
      <DialogBlockAndDeleteConversation
        open={isShowDeleteConversation}
        onOpenChange={setIsShowDeleteConversation}
      />
      <div className="flex flex-row space-x-2">
        <TooltipIcon
          className={"h-[52px] text-red-600"}
          context={"Chặn tài khoản"}
          onClick={() => setIsShowBlockUser(true)}
        >
          <UserX className="size-5" />
          <span className="text-sm">Chặn</span>
        </TooltipIcon>
        <TooltipIcon
          className={"h-[52px] text-red-600"}
          context={"Xóa cuộc hội thoại"}
          onClick={() => setIsShowDeleteConversation(true)}
        >
          <Trash2 className="size-5" />
          <span className="text-sm">Xóa</span>
        </TooltipIcon>
      </div>
    </div>
  );
};

const TooltipIcon = ({ children, context, onClick, className }) => {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className={cn("w-full space-x-1", className)}
            onClick={() => onClick && onClick()}
          >
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="end">
          {context}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const DialogBlockAndDeleteConversation = ({ open, onOpenChange, block }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSumbit = () => {
    setIsLoading(true);
    const setTimeoutId = setTimeout(() => {
      try {
        toast.success(
          block
            ? "Chặn tài khoản thành công."
            : "Xóa đoạn hội thoại thành công."
        );
        onOpenChange(false);
      } catch (error) {
        toast.error(error.message);
        console.error(error.message);
      } finally {
        setIsLoading(false);
      }
    }, 2000);

    return () => clearTimeout(setTimeoutId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {block ? "Chặn tài khoản" : "Xóa cuộc hội thoại"}
          </DialogTitle>
          <DialogDescription>{`Bạn có chắc muốn ${
            block ? "chặn tài khoản" : "xóa cuộc hội thoại"
          } này?`}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2">
            Hủy
          </DialogClose>
          <LoadingButton
            variant="outline"
            loading={isLoading}
            disabled={isLoading}
            onClick={handleSumbit}
          >
            {block ? "Chặn" : "Xóa"}
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
