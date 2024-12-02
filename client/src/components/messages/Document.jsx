import React, { memo } from "react";
import { Button, UserAvatar } from "..";
import icons from "@/lib/icons";
import { cn, extractLinks } from "@/lib/utils";
import { formatDate } from "date-fns";

const { Check, CheckCheck, File, Download } = icons;

const Document = ({
  incoming,
  author,
  timestamp,
  read_receipt,
  className,
  content,
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
          <div className="flex flex-row items-center justify-between p-2 bg-gray-50 border rounded-md space-x-5 mb-2 text-primary-foreground">
            <div className="flex flex-row items-center space-x-3">
              <div className="p-2 rounded-md bg-primary border">
                <File className="size-6" />
              </div>
              <div className="flex flex-col">
                <span>admin_v1.0.zip</span>
                <small className="font-medium opacity-50">12.5MB</small>
              </div>
            </div>
            <Button variant="outline" size="icon" className="bg-primary">
              <Download className="size-5" />
            </Button>
          </div>
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

export default memo(Document);
