import icons from "@/lib/icons";
import React from "react";
import { Button } from "./ui";
import { cn } from "@/lib/utils";

const { LoaderCircle } = icons;

const LoadingButton = ({ loading, disabled, className, ...props }) => {
  return (
    <Button
      disabled={loading || disabled}
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      {loading && <LoaderCircle className="size-5 animate-spin" />}
      {props.children}
    </Button>
  );
};

export default LoadingButton;
