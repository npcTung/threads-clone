import { cn, extractLinks } from "@/lib/utils";
import React, { memo } from "react";
import { Button, UserAvatar } from "..";
import { formatDate } from "date-fns";
import icons from "@/lib/icons";

const { Check, CheckCheck, Download } = icons;

const Media = ({
  incoming,
  author,
  timestamp,
  read_receipt,
  content,
  className,
  medias,
}) => {
  const { originalString } = extractLinks(content);

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
          <MediasGrid medias={medias} />
          <span
            dangerouslySetInnerHTML={{
              __html: originalString,
            }}
          />
        </div>
        <div
          className={cn(
            "flex flex-row items-center space-x-2",
            incoming && "justify-end",
            read_receipt === "read" && "text-muted-foreground"
          )}
        >
          <div className="flex flex-row items-center space-x-1 opacity-50">
            {read_receipt !== "sent" ? (
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

export default memo(Media);

const MediasGrid = ({ medias }) => {
  return (
    <div
      className={cn(
        "grid grid-cols-2 grid-rows-2 gap-3 rounded-md overflow-hidden"
      )}
    >
      {medias.slice(0, 4).map((media, idx) => (
        <div
          key={idx}
          className={cn(
            "relative h-[150px]",
            medias.length === 1 && "col-span-2 row-span-2",
            medias.length === 2 && "col-span-1 row-span-2",
            medias.length > 2 && "col-span-1 row-span-1"
          )}
        >
          <img src={media} alt={media} className="size-full object-cover" />
          {idx < 3 && (
            <Button
              variant="outline"
              size="icon"
              className="absolute top-2 right-2 bg-primary/70 border-none"
            >
              <Download className="size-5" />
            </Button>
          )}
          {idx === 3 && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center text-black text-2xl">
              {`+${medias.length - 3}`}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
