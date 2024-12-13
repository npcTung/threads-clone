import React from "react";
import { Button } from "./ui";
import { Link } from "react-router-dom";
import path from "@/lib/path";
import icons from "@/lib/icons";
import { cn } from "@/lib/utils";
import useConversationStore from "@/zustand/useConversationStore";

const { MessageCircle } = icons;

const Messager = ({ pathName }) => {
  const { setConversation, conversation } = useConversationStore();

  return (
    <Button
      variant={"ghost"}
      className="flex items-center justify-start"
      asChild
    >
      <Link
        to={`/${path.MESSAGER}`}
        onClick={() => conversation && setConversation(null)}
      >
        <div className="relative">
          <MessageCircle
            className={cn(
              "opacity-50 hover:opacity-100 transition-all",
              pathName === "/messager" && "opacity-100"
            )}
          />
        </div>
      </Link>
    </Button>
  );
};

export default Messager;
