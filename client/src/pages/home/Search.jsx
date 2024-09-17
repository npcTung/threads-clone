import {
  FollowerCount,
  Input,
  UserAvatar,
  UserTooltip,
  useTheme,
} from "@/components";
import { users } from "@/data";
import icons from "@/lib/icons";
import { cn } from "@/lib/utils";
import React from "react";
import { Link } from "react-router-dom";

const { SearchIcon } = icons;

const Search = () => {
  return (
    <div className="w-[720px] mx-auto my-10 border min-h-full p-6 space-y-5 md:rounded-2xl">
      <SearchField />
      <div>
        <span className="font-semibold text-sm opacity-50">Gợi ý theo dõi</span>
      </div>
      <UserPreviews datas={users} />
    </div>
  );
};

export default Search;

const SearchField = () => {
  const { theme } = useTheme();

  const handleSumbit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const q = form.q.value.trim();
    if (!q) return;
  };

  return (
    <form onSubmit={handleSumbit}>
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground" />
        <Input
          name="q"
          placeholder="Search"
          className={cn(
            "ps-10",
            theme === "dark" ? "bg-background" : "bg-muted"
          )}
        />
      </div>
    </form>
  );
};

const UserPreviews = ({ datas }) => {
  return (
    <div>
      {datas.map((data) => (
        <UserPreview key={data.id} data={data} />
      ))}
    </div>
  );
};

const UserPreview = ({ data }) => {
  return (
    <div className={"w-full flex items-center justify-between p-5"}>
      <div className="flex gap-3 w-full">
        <div className="flex flex-col items-center">
          <Link to={`/${data.userName}`}>
            <UserAvatar avatarUrl={data.avatarUrl} />
          </Link>
        </div>
        <Link to={`/${data.userName}`} className="w-full">
          <div className="flex-1 w-full space-y-5 border-b pb-2">
            <div className="flex flex-col">
              <div className="flex justify-between w-full">
                <div className="flex w-full items-center">
                  <UserTooltip user={data}>
                    <span className="text-sm font-medium hover:underline">
                      {data.userName}
                    </span>
                  </UserTooltip>
                </div>
              </div>
              <span className="text-sm opacity-50">{data.displayName}</span>
            </div>
            <FollowerCount className={"text-sm"} />
          </div>
        </Link>
      </div>
    </div>
  );
};
