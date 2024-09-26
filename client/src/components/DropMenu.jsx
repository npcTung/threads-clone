import icons from "@/lib/icons";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui";
import { useTheme } from ".";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import path from "@/lib/path";
import * as apis from "@/apis";
import { toast } from "sonner";
import useCurrentStore from "@/zustand/useCurrentStore";
import usePostsStore from "@/zustand/usePostsStore";
import PropTypes from "prop-types";

const { AlignLeft, Sun, Moon, LogOutIcon, UserIcon, Monitor, Check } = icons;

const DropMenu = ({ className }) => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { currentData, clearCurrentData } = useCurrentStore();
  const { clearPostData } = usePostsStore();

  const handleLogout = async () => {
    try {
      const response = await apis.logout();
      if (response.success) {
        clearCurrentData();
        clearPostData();
        navigate(`/${path.AUTH}/${path.LOGIN}`);
      }
    } catch (error) {
      toast.error(error.response.data.mes);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={cn("flex-none rounded-full", className)}>
          <AlignLeft className="size-5 opacity-50 hover:opacity-100" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start">
        <DropdownMenuLabel className="cursor-default">{`Looged in as @Tungdeptrai`}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link to={`/${currentData?.userName}`}>
          <DropdownMenuItem className="cursor-pointer">
            <UserIcon className="mr-2 size-4" />
            Trang cá nhân
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer">
            <Monitor className="mr-2 size-4" />
            Chủ đề
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                onClick={() => setTheme("ligth")}
                className="flex cursor-pointer items-center justify-between"
              >
                <div className="flex items-center">
                  <Sun className="mr-2 size-4" />
                  Sáng
                </div>
                {theme === "ligth" && <Check className="ms-2 size-4" />}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setTheme("dark")}
                className="flex cursor-pointer items-center justify-between"
              >
                <div className="flex items-center">
                  <Moon className="mr-2 size-4" />
                  Tối
                </div>
                {theme === "dark" && <Check className="ms-2 size-4" />}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
          <LogOutIcon className="mr-2 size-4" />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropMenu;

DropMenu.prototype = {
  className: PropTypes.string,
};
