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
import PropTypes from "prop-types";
import usePostsStore from "@/zustand/usePostsStore";
import { LoadingButton } from "..";

const DialogDeletePost = ({ open, onOpenChange, postId }) => {
  const { deletePost, isCreateLoading } = usePostsStore();
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
          <LoadingButton
            loading={isCreateLoading}
            variant="destructive"
            onClick={() => deletePost(postId)}
          >
            Xóa
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogDeletePost;

DialogDeletePost.propTypes = {
  onOpenChange: PropTypes.func.isRequired,
  postId: PropTypes.string.isRequired,
};
