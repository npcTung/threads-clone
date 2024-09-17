import { HeaderPost, Post } from "@/components";
import { dataPosts } from "@/data";
import React from "react";

const Posts = () => {
  return (
    <div className="max-w-[720px] max-sm:w-full mx-auto my-10 border min-h-screen space-y-5 md:rounded-2xl">
      <HeaderPost />
      {dataPosts.map((post, idx) => (
        <Post
          key={post.id}
          className={idx !== Array(20).length - 1 && "border-b"}
          data={post}
        />
      ))}
    </div>
  );
};

export default Posts;
