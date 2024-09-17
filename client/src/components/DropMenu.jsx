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

const { AlignLeft, Sun, Moon, LogOutIcon, UserIcon, Monitor, Check } = icons;

const DropMenu = ({ className }) => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
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
        <Link to={`/tungdeptrai`}>
          <DropdownMenuItem className="cursor-pointer">
            <UserIcon className="mr-2 size-4" />
            Profile
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer">
            <Monitor className="mr-2 size-4" />
            Theme
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                onClick={() => setTheme("ligth")}
                className="flex cursor-pointer items-center justify-between"
              >
                <div className="flex items-center">
                  <Sun className="mr-2 size-4" />
                  Ligth
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
                  Dark
                </div>
                {theme === "dark" && <Check className="ms-2 size-4" />}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => navigate(`/${path.AUTH}/${path.LOGIN}`)}
        >
          <LogOutIcon className="mr-2 size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropMenu;
