import icons from "@/lib/icons";
import { cn } from "@/lib/utils";
import React, { memo } from "react";
import { UserAvatar, Waveform } from "..";
import { formatDate } from "date-fns";

const { Check, CheckCheck } = icons;

const Voice = ({
  incoming,
  author,
  timestamp,
  read_receipt,
  className,
  audio,
}) => {
  return (
    <div className={cn(className, incoming && "justify-end")}>
      {!incoming && (
        <UserAvatar
          avatarUrl={author.avatarUrl}
          displayName={author.displayName}
          className={"border border-primary"}
        />
      )}
      <div className="max-w-[500px]">
        {!incoming && (
          <span className="mb-2.5 text-sm font-medium cursor-default">
            {author.displayName}
          </span>
        )}
        <div
          className={cn(
            "mb-2.5 rounded-2xl px-5 py-3 space-y-2",
            !incoming
              ? "rounded-tl-none bg-muted"
              : "rounded-br-none bg-primary text-primary-foreground"
          )}
        >
          <Waveform incoming={incoming} audioUrl={audio.url} />
        </div>
        <div
          className={cn(
            "flex flex-row items-center space-x-2",
            incoming && "justify-end",
            read_receipt && "text-muted-foreground"
          )}
        >
          <div className="flex flex-row items-center space-x-1 opacity-50">
            {read_receipt ? (
              <CheckCheck className="size-4" />
            ) : (
              <Check className="size-4" />
            )}
            <span className="text-sm cursor-default">
              {formatDate(timestamp, "HH:mm")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Voice);
