import React, { memo } from "react";
import { Button, UserAvatar } from "..";
import icons from "@/lib/icons";
import { bytesToMB, cn } from "@/lib/utils";
import { formatDate } from "date-fns";
import { toast } from "sonner";

const { Check, CheckCheck, File, Download } = icons;

const Document = ({
  incoming,
  author,
  timestamp,
  read_receipt,
  className,
  document,
}) => {
  const handleDowload = async () => {
    const response = await fetch(document.url);
    const blod = await response.blob();
    zip.file(document.name, blod);

    zip.generateAsync({ type: "blob" }).then((content) => {
      const link = document.createElement("a");
      const url = window.URL.createObjectURL(content);
      link.href = url;
      link.download = "files.zip";
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success("Tải xuống thành công.");
    });
  };

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
              <div className="flex flex-col text-black">
                <span className="line-clamp-1">{document.name}</span>
                <small className="font-medium opacity-50">
                  {`${bytesToMB(document.size)} MB`}
                </small>
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="bg-primary"
              onClick={handleDowload}
            >
              <Download className="size-5" />
            </Button>
          </div>
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

export default memo(Document);
