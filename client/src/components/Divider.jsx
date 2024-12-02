import { cn } from "@/lib/utils";
import React, { memo } from "react";

const Divider = ({ className }) => (
  <div className={cn("border border-muted", className)} />
);

export default memo(Divider);
