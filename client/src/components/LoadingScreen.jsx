import icons from "@/lib/icons";
import React from "react";

const { LoaderCircle } = icons;

const LoadingScreen = () => {
  return (
    <div className="w-full flex items-center justify-center">
      <LoaderCircle className={"size-10 animate-spin"} />
    </div>
  );
};

export default LoadingScreen;
