import { cn, extractLinks } from "@/lib/utils";
import { formatDate } from "date-fns";
import React, { memo } from "react";
import { UserAvatar, useTheme } from "..";
import Microlink from "@microlink/react";
import icons from "@/lib/icons";

const { Check, CheckCheck } = icons;

const Text = ({
  incoming,
  author,
  timestamp,
  read_receipt,
  content,
  className,
}) => {
  const { links, originalString } = extractLinks(content);
  const { theme } = useTheme();

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
          <span
            dangerouslySetInnerHTML={{
              __html: originalString,
            }}
          />
          {links.length > 0 && (
            <Microlink
              url={links[0]}
              media="auto"
              lazy
              theme={theme}
              lang="vi"
              fallback={<span>Không thể tải link preview</span>}
              style={{
                background: "transparent",
                borderRadius: "10px",
                color: incoming
                  ? theme === "dark"
                    ? "#000"
                    : "#fff"
                  : theme === "dark"
                  ? "#fff"
                  : "#000",
              }}
            />
          )}
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

export default memo(Text);
