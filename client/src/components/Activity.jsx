import React from "react";
import { Button } from "./ui";
import { Link } from "react-router-dom";
import path from "@/lib/path";
import icons from "@/lib/icons";

const { Heart } = icons;

const Activity = () => {
  return (
    <Button
      variant={"ghost"}
      className="flex items-center justify-start"
      asChild
    >
      <Link to={`/${path.ACTIVITY}`}>
        <div className="relative">
          <Heart />
          <span className="absolute -right-1 -top-1 rounded-full bg-red-600 px-1 text-xs font-medium tabular-nums text-white">
            10
          </span>
        </div>
      </Link>
    </Button>
  );
};

export default Activity;