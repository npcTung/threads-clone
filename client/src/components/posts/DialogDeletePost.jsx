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
import { LoadingButton } from "..";
import { useDeletePostMutation } from "./mutations";
import { useNavigate } from "react-router-dom";
import path from "@/lib/path";

const DialogDeletePost = ({ open, onOpenChange, postId }) => {
  const mutation = useDeletePostMutation();
  const navigate = useNavigate();
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
            loading={mutation.isPending}
            variant="destructive"
            onClick={() =>
              mutation.mutate(postId, {
                onSuccess: () => {
                  onOpenChange(false);
                  navigate(path.HOME);
                },
              })
            }
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
