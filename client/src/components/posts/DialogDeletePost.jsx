import React from "react";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui";

const DialogDeletePost = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xóa bài viết</DialogTitle>
          <DialogDescription>
            Bạn có chắc muốn xóa bài viết này?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"outline"}>Hủy</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={() => console.log("Delete post")}
          >
            Xóa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogDeletePost;
