import icons from "@/lib/icons";
import React, { memo } from "react";

const { LoaderCircle } = icons;

const LoadingScreen = () => {
  return (
    <div className="w-full flex items-center justify-center">
      <LoaderCircle className={"size-10 animate-spin"} />
    </div>
  );
};

export default memo(LoadingScreen);
