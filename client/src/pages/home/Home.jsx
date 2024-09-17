import {
  Button,
  DialogCreatePost,
  DropMenu,
  MenuBar,
  Navbar,
  useTheme,
} from "@/components";
import path from "@/lib/path";
import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import logo from "@/assets/logo.svg";
import darklogo from "@/assets/darklogo.svg";
import icons from "@/lib/icons";

const { Plus } = icons;

const Home = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const { theme } = useTheme();

  return (
    <div className="flex min-h-screen flex-col">
      <DialogCreatePost
        open={showCreatePost}
        onOpenChange={() => setShowCreatePost(false)}
      />
      <Navbar />
      <div className="flex w-full grow gap-5">
        <div className="sticky top-0 hidden h-screen flex-none bg-card sm:block p-5 md:flex md:flex-col items-center justify-between">
          <Link to={path.HOME}>
            <img
              src={theme === "ligth" ? logo : darklogo}
              alt="logo"
              className="size-9"
            />
          </Link>
          <MenuBar
            className={"space-y-3"}
            setShowCreatePost={() => setShowCreatePost(true)}
          />
          <DropMenu />
        </div>
        <Outlet />
      </div>
      <MenuBar
        className="sticky bottom-0 flex w-full justify-center gap-5 bg-card p-3 sm:hidden"
        setShowCreatePost={() => setShowCreatePost(true)}
      />
      <CreateButtonPost setShowCreatePost={() => setShowCreatePost(true)} />
    </div>
  );
};

export default Home;

const CreateButtonPost = ({ setShowCreatePost }) => {
  return (
    <Button
      variant={"outline"}
      size={"icons"}
      className="fixed bottom-10 right-5 w-fit p-5 shadow-lg max-sm:hidden"
      onClick={setShowCreatePost}
    >
      <Plus />
    </Button>
  );
};
