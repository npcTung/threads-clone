import React from "react";
import { Button } from "./ui";
import { Link } from "react-router-dom";
import path from "@/lib/path";
import icons from "@/lib/icons";

const { MessageCircle } = icons;

const Messager = () => {
  return (
    <Button
      variant={"ghost"}
      className="flex items-center justify-start"
      asChild
    >
      <Link to={`/${path.MESSAGER}`}>
        <div className="relative">
          <MessageCircle />
          <span className="absolute -right-1 -top-1 rounded-full bg-red-600 px-1 text-xs font-medium tabular-nums text-white">
            +50
          </span>
        </div>
      </Link>
    </Button>
  );
};

export default Messager;
