import path from "@/lib/path";
import React from "react";
import { DropMenu, useTheme } from ".";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.svg";
import darklogo from "@/assets/darklogo.svg";

const Navbar = () => {
  const { theme } = useTheme();

  return (
    <header className="sticky top-0 z-10 bg-muted shadow-md">
      <div className="mx-auto max-sm:flex max-w-7xl items-center hidden justify-center gap-5 px-5 py-3">
        <div className="flex justify-center w-full">
          <Link to={path.HOME}>
            <img
              src={theme === "ligth" ? logo : darklogo}
              alt="logo"
              className="size-6"
            />
          </Link>
        </div>
        <DropMenu className="sm:ms-auto" />
      </div>
    </header>
  );
};

export default Navbar;
