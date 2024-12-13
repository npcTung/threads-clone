import {
  Button,
  DialogCreatePost,
  DialogSetting,
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
import icons from "@/lib/icons";
import useCurrentStore from "@/zustand/useCurrentStore";
import { cn, setTitle } from "@/lib/utils";
import useAppStore from "@/zustand/useAppStore";
import useCurrentData from "@/hooks/useCurrentData";
import { connectSocket } from "@/lib/socketConfig";

const { Plus, ChevronDown, Check } = icons;

const Home = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const { isLoggedIn, currentData, isLoading, token } = useCurrentStore();
  const { sortPost, isShowSetting, setIsShowSetting } = useAppStore();
  const navigate = useNavigate();
  const currentUser = useCurrentData();

  useEffect(() => {
    if (!isLoggedIn) navigate(`/${path.AUTH}/${path.LOGIN}`);

    if (isLoggedIn) {
      currentUser.getCurrentData();
      connectSocket(token);
    }
  }, [isLoggedIn]);

  if (!currentData || isLoading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-muted">
      {/* create post */}
      <DialogCreatePost
        open={showCreatePost}
        onOpenChange={setShowCreatePost}
      />
      {/* show setting */}
      <DialogSetting
        open={isShowSetting}
        onOpenChange={() => setIsShowSetting(isShowSetting)}
      />
      <Navbar />
      <div className="flex w-full">
        <div className="sticky top-0 hidden h-screen flex-none bg-muted sm:block p-5 md:flex md:flex-col items-center justify-between">
          <Link to={path.HOME}>
            <IconLogo />
          </Link>
          <MenuBar
            className={"space-y-3"}
            setShowCreatePost={() => setShowCreatePost(true)}
          />
          <DropMenu />
        </div>
        <div className={"size-full"}>
          <div
            className={cn(
              "flex items-center justify-center",
              sortPost === "Tin nhắn" && "hidden"
            )}
          >
            <DropPosts userName={currentData.userName} />
          </div>
          <Outlet />
        </div>
      </div>
      <MenuBar
        className="sticky bottom-0 flex w-full justify-center gap-5 bg-muted p-3 sm:hidden"
        setShowCreatePost={() => setShowCreatePost(true)}
      />
      {sortPost !== "Tin nhắn" && (
        <CreateButtonPost setShowCreatePost={() => setShowCreatePost(true)} />
      )}
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
  const { setSortPost, sortPost } = useAppStore();
  const { user_name } = useParams();

  useEffect(() => {
    if (window.location.pathname === "/") setSortPost("Dành cho bạn");
    else if (window.location.pathname === "/search") setSortPost("Tìm kiếm");
    else if (window.location.pathname === "/activity") setSortPost("Hoạt động");
    else if (window.location.pathname === "/404") setSortPost("404");
    else if (window.location.pathname.split("/")[1] === "messager")
      setSortPost("Tin nhắn");
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

const IconLogo = ({ size }) => {
  const { theme } = useTheme();

  return (
    <svg
      aria-label="Threads"
      className="x1ypdohk x13dflua x11xpdln xk4oym4 xus2keu"
      fill={theme === "dark" ? "#ffffff" : "var(--primary)"}
      role="img"
      viewBox="0 0 192 192"
      height={size || 36}
      width={size || 36}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z"></path>
    </svg>
  );
};
