import React, { memo } from "react";
import { Link } from "react-router-dom";
import path from "@/lib/path";
import icons from "@/lib/icons";
import { Activity, Button, Messager } from ".";
import useCurrentStore from "@/zustand/useCurrentStore";
import useConversationStore from "@/zustand/useConversationStore";
import PropTypes from "prop-types";
import { cn } from "@/lib/utils";

const { Home, Search, Plus, UserIcon } = icons;

const MenuBar = ({ className, setShowCreatePost }) => {
  const { currentData } = useCurrentStore();
  const { setConversation, conversation } = useConversationStore();
  const pathName = window.location.pathname;

  return (
    <div className={className}>
      {/* home */}
      <Button
        variant={"ghost"}
        className="flex items-center justify-start"
        asChild
        onClick={() => conversation && setConversation(null)}
      >
        <Link to={path.HOME}>
          <Home
            className={cn(
              "opacity-50 hover:opacity-100 transition-all",
              pathName === "/" && "opacity-100"
            )}
          />
        </Link>
      </Button>
      {/* search */}
      <Button
        variant={"ghost"}
        className="flex items-center justify-start"
        asChild
        onClick={() => conversation && setConversation(null)}
      >
        <Link to={`/${path.SEARCH}`}>
          <Search
            className={cn(
              "opacity-50 hover:opacity-100 transition-all",
              pathName === "/search" && "opacity-100"
            )}
          />
        </Link>
      </Button>
      {/* messager */}
      <Messager pathName={pathName} />
      {/* push */}
      <Button
        variant={"ghost"}
        className="flex items-center justify-start"
        onClick={setShowCreatePost}
      >
        <Plus className="opacity-50 hover:opacity-100 transition-all" />
      </Button>
      {/* activity */}
      <Activity pathName={pathName} />
      {/* profile */}
      <Button
        variant={"ghost"}
        className="flex items-center justify-start"
        asChild
        onClick={() => conversation && setConversation(null)}
      >
        <Link to={`/${currentData?.userName}`}>
          <UserIcon
            className={cn(
              "opacity-50 hover:opacity-100 transition-all",
              pathName === `/${currentData.userName}` && "opacity-100"
            )}
          />
        </Link>
      </Button>
    </div>
  );
};

export default memo(MenuBar);

MenuBar.prototype = {
  className: PropTypes.string,
  setShowCreatePost: PropTypes.func.isRequired,
};
