import React, { useState } from "react";
import { Button, DialogCreatePost, UserAvatar } from "..";
import { Link } from "react-router-dom";
import useCurrentStore from "@/zustand/useCurrentStore";

const HeaderPost = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const { currentData } = useCurrentStore();

  return (
    <>
      <DialogCreatePost
        open={showCreatePost}
        onOpenChange={() => setShowCreatePost(false)}
      />
      <div className="w-full flex items-center justify-between p-5 border-b">
        <div className="flex gap-5 items-center w-full">
          <Link to={`/${currentData?.userName}`}>
            <UserAvatar
              avatarUrl={currentData?.avatarUrl}
              displayName={currentData?.displayName}
            />
          </Link>
          <span
            className="opacity-50 w-full cursor-text"
            onClick={() => setShowCreatePost(true)}
          >
            Có gì mới?
          </span>
        </div>
        <Button variant="outline" onClick={() => setShowCreatePost(true)}>
          Đăng
        </Button>
      </div>
    </>
  );
};

export default HeaderPost;
