import icons from "@/lib/icons";
import React, { memo } from "react";
import { Button } from "./ui";
import { cn } from "@/lib/utils";
import PropTypes from "prop-types";

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

export default memo(LoadingButton);

LoadingButton.prototype = {
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};
