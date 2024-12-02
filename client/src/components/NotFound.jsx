import path from "@/lib/path";
import React, { memo } from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <main className="my-40 mx-auto flex h-full w-[720px] flex-col items-center space-y-3 text-center">
      <h1 className="text-3xl font-bold">Không tìm thấy</h1>
      <span>Trang bạn đang tìm kiếm không tồn tại.</span>
      <Link to={path.HOME} className="w-fit text-primary hover:underline">
        Đi về trang chủ
      </Link>
    </main>
  );
};

export default memo(NotFound);
