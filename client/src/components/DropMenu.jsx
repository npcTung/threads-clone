import icons from "@/lib/icons";
import React, { memo } from "react";
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
import PropTypes from "prop-types";
import useAppStore from "@/zustand/useAppStore";
import { socket } from "@/lib/socketConfig";
import useConversationStore from "@/zustand/useConversationStore";

const { AlignLeft, Sun, Moon, LogOutIcon, UserIcon, Monitor, Check, Settings } =
  icons;

const DropMenu = ({ className }) => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { currentData, clearCurrentData } = useCurrentStore();
  const { clearAppData, isShowSetting, setIsShowSetting } = useAppStore();
  const { clearConversation, setConversation, conversation } =
    useConversationStore();

  const handleLogout = async () => {
    try {
      const response = await apis.logout();
      if (response.success) {
        clearCurrentData();
        clearAppData();
        clearConversation();
        socket.disconnect();
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
        <DropdownMenuLabel className="cursor-default">{`Looged in as @${currentData.userName}`}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link to={`/${currentData?.userName}`}>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => conversation && setConversation(null)}
          >
            <UserIcon className="mr-2 size-4" />
            Trang cá nhân
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => setIsShowSetting(isShowSetting)}
        >
          <Settings className="mr-2 size-4" />
          Cài đặt
        </DropdownMenuItem>
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

export default memo(DropMenu);

DropMenu.prototype = {
  className: PropTypes.string,
};
