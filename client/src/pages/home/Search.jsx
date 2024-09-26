import {
  FollowerCount,
  Input,
  LoadingScreen,
  UserAvatar,
  UserTooltip,
  useTheme,
} from "@/components";
import icons from "@/lib/icons";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as apis from "@/apis";
import { toast } from "sonner";
import useDebounce from "@/hooks/useDebounce";

const { SearchIcon } = icons;

const Search = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [queries, setQueries] = useState({ q: "" });
  const queriesDebounce = useDebounce(queries, 800);

  const fetchGetUsers = async (queries) => {
    try {
      setIsLoading(true);
      const response = await apis.getUsers(queries);
      if (response.success) setUsers(response.data);
    } catch (error) {
      console.error(error.response.data.mes);
      setQueries([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGetUsers(queriesDebounce);
  }, [queriesDebounce]);

  return (
    <div className="max-w-[720px] w-full p-5 mx-auto mb-10 border space-y-5 md:rounded-2xl bg-card">
      <SearchField setQueries={setQueries} />
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <div>
            <span className="font-semibold text-sm opacity-50">
              Gợi ý theo dõi
            </span>
          </div>
          {users.length > 0 ? (
            <UserPreviews datas={users} />
          ) : (
            <span>Không có người dùng nào.</span>
          )}
        </>
      )}
    </div>
  );
};

export default Search;

const SearchField = ({ setQueries }) => {
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
          onChange={(e) => setQueries({ q: e.target.value })}
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
      {datas?.length &&
        datas.map((data) => <UserPreview key={data._id} data={data} />)}
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
            <FollowerCount
              className={"text-sm"}
              follower={data.follower.length}
            />
          </div>
        </Link>
      </div>
    </div>
  );
};
