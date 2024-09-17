import path from "@/lib/path";
import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <main className="my-40 mx-auto flex h-full w-[720px] flex-col items-center space-y-3 text-center">
      <h1 className="text-3xl font-bold">Not Found</h1>
      <span>The page you are looking for does not exits.</span>
      <Link to={path.HOME} className="w-fit text-primary hover:underline">
        Go to home
      </Link>
    </main>
  );
};

export default NotFound;
