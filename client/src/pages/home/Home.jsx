import {
  Button,
  DialogCreatePost,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropMenu,
  LoadingScreen,
  MenuBar,
  Navbar,
  useTheme,
} from "@/components";
import path from "@/lib/path";
import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import logo from "@/assets/logo.svg";
import darklogo from "@/assets/darklogo.svg";
import icons from "@/lib/icons";
import useCurrentStore from "@/zustand/useCurrentStore";
import usePostsStore from "@/zustand/usePostsStore";
import { setTitle } from "@/lib/utils";

const { Plus, ChevronDown, Check } = icons;

const Home = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const { theme } = useTheme();
  const { getCurrentData, isLoggedIn, currentData } = useCurrentStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) navigate(`/${path.AUTH}/${path.LOGIN}`);
    const setTimeoutId = setTimeout(() => {
      if (isLoggedIn) getCurrentData();
    }, 1000);

    return () => clearTimeout(setTimeoutId);
  }, [isLoggedIn]);

  if (!currentData) return <LoadingScreen />;
  return (
    <div className="flex min-h-screen flex-col bg-muted">
      <DialogCreatePost
        open={showCreatePost}
        onOpenChange={() => setShowCreatePost(false)}
      />
      <Navbar />
      <div className="flex w-full grow gap-5">
        <div className="sticky top-0 hidden h-screen flex-none bg-muted sm:block p-5 md:flex md:flex-col items-center justify-between">
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
        <div className="w-full">
          <div className="flex items-center justify-center">
            <DropPosts userName={currentData.userName} />
          </div>
          <Outlet />
        </div>
      </div>
      <MenuBar
        className="sticky bottom-0 flex w-full justify-center gap-5 bg-muted p-3 sm:hidden"
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
      className="fixed bottom-10 right-5 w-fit p-5 hover:bg-card hover:p-6 transition-all shadow-lg max-sm:hidden"
      onClick={setShowCreatePost}
    >
      <Plus />
    </Button>
  );
};

const dropPostLists = ["Dành cho bạn", "Đang theo dõi", "Đã thích", "Đã lưu"];

const DropPosts = ({ userName }) => {
  const { setSortPost, sortPost } = usePostsStore();
  const { user_name } = useParams();

  useEffect(() => {
    if (window.location.pathname === "/") setSortPost("Dành cho bạn");
    else if (window.location.pathname === "/search") setSortPost("Tìm kiếm");
    else if (window.location.pathname === "/messager") setSortPost("Tin nhắn");
    else if (window.location.pathname === "/activity") setSortPost("Hoạt động");
    else if (window.location.pathname === "/404") setSortPost("404");
    else if (window.location.pathname.split("/")[1] === "post")
      setSortPost("Threads");
    else setSortPost(user_name === userName ? "Trang cá nhân" : user_name);
  }, [window.location.pathname, user_name]);

  setTitle(sortPost);

  return (
    <div className="sticky top-0 hidden flex-none bg-muted sm:block p-5 md:flex md:flex-col items-center justify-between">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex gap-5 items-center justify-between w-[200px] cursor-pointer">
            <span className="font-medium w-full text-center">{sortPost}</span>
            {window.location.pathname === "/" && (
              <ChevronDown className="rounded-full border cursor-pointer p-1 size-10" />
            )}
          </div>
        </DropdownMenuTrigger>
        {window.location.pathname === "/" && (
          <DropdownMenuContent className="p-3">
            {dropPostLists.map((item, idx) => (
              <DropdownMenuItem
                className="p-5 text-[15px] w-60 flex items-center justify-between"
                key={idx}
                onClick={() => setSortPost(item)}
              >
                {item}
                {sortPost === item && <Check className="ms-2 size-4" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </div>
  );
};
