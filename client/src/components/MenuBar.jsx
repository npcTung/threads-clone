import React from "react";
import { Link } from "react-router-dom";
import path from "@/lib/path";
import icons from "@/lib/icons";
import { Activity, Button, Messager } from ".";

const { Home, Search, Plus, UserIcon } = icons;

const MenuBar = ({ className, setShowCreatePost }) => {
  return (
    <div className={className}>
      <Button
        variant={"ghost"}
        className="flex items-center justify-start"
        asChild
      >
        <Link to={path.HOME}>
          <Home />
        </Link>
      </Button>
      <Button
        variant={"ghost"}
        className="flex items-center justify-start"
        asChild
      >
        <Link to={`/${path.SEARCH}`}>
          <Search />
        </Link>
      </Button>
      <Messager />
      <Activity />
      <Button
        variant={"ghost"}
        className="flex items-center justify-start"
        onClick={setShowCreatePost}
      >
        <Plus />
      </Button>
      <Button
        variant={"ghost"}
        className="flex items-center justify-start"
        asChild
      >
        <Link to={`/tungdeptrai`}>
          <UserIcon />
        </Link>
      </Button>
    </div>
  );
};

export default MenuBar;
