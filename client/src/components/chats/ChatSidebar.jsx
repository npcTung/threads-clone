import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { Button, Divider, Input, ScrollArea, UserAvatar } from "..";
import icons from "@/lib/icons";
import { chatList } from "@/data";
import { formatDate } from "date-fns";

const { Search } = icons;

const ChatSidebar = ({ className }) => {
  return (
    <div className={cn(className)}>
      {/* Header chat */}
      <HeaderChat className={"sticky px-6 pt-[30px] pb-2 space-y-1"} />
      {/* Search input */}
      <SearchInput className={"flex max-h-full flex-col px-5"} />
      {/* Chat element  */}
      <ScrollArea className="max-h-full px-5 py-2">
        <div className="max-h-full space-y-3">
          {chatList.map((chat) => (
            <ChatElement
              key={chat.id}
              data={chat}
              className={
                "px-4 py-2 flex cursor-pointer items-center rounded-md bg-muted hover:bg-muted-foreground transition-all"
              }
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatSidebar;

const HeaderChat = ({ className }) => {
  return (
    <div className={cn(className)}>
      <div className="space-x-1 flex items-center flex-row">
        <h1 className="text-xl 2xl:text-2xl font-bold cursor-default">Chats</h1>
        <span className="cursor-default rounded-md border px-2 py-0.5 text-base font-medium bg-muted w-fit 2xl:ml-4">
          8
        </span>
      </div>
      <Divider />
    </div>
  );
};

const SearchInput = ({ className }) => {
  const [inputSearch, setInputSearch] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(inputSearch);
    setInputSearch("");
  };

  return (
    <div className={cn(className)}>
      <form className="sticky mb-2" onSubmit={handleSubmit}>
        <Input
          placeholder="Tìm kiếm..."
          onChange={(e) => setInputSearch(e.target.value)}
          value={inputSearch}
          className="w-full rounded-md bg-muted pr-10"
        />
        <Button
          variant="ghost"
          size="icon"
          type="submit"
          className="absolute right-1 top-1/2 -translate-y-1/2"
          disabled={!inputSearch.trim()}
        >
          <Search className="size-5" />
        </Button>
      </form>
      <Divider />
    </div>
  );
};

const ChatElement = ({ className, data }) => {
  return (
    <div className={cn("justify-between", className)}>
      <div className="w-full flex items-center space-x-2">
        <UserAvatar
          avatarUrl={data.url}
          displayName={data.name}
          className={"border border-primary"}
          isOnline={data.online}
        />
        <div className="w-full">
          <span className="text-sm font-medium line-clamp-1">{data.name}</span>
          <small className="opacity-50 line-clamp-1">{data.msg}</small>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-sm opacity-50 whitespace-nowrap">
          {formatDate(data.time, "HH:mm")}
        </span>
        <span className="rounded-full bg-red-600 px-1 text-xs font-medium tabular-nums text-white">
          {+data.unread > 50 ? "+50" : +data.unread}
        </span>
      </div>
    </div>
  );
};
