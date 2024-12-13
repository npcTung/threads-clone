import { cn } from "@/lib/utils";
import React, { memo, useState } from "react";
import {
  Button,
  Carousel,
  CarouselContent,
  CarouselItem,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  UserAvatar,
} from "..";
import { formatDate } from "date-fns";
import icons from "@/lib/icons";
import { toast } from "sonner";
import JSZip from "jszip";

const { Check, CheckCheck, Download } = icons;

const Media = ({
  incoming,
  author,
  timestamp,
  read_receipt,
  className,
  medias,
}) => {
  const [isShowMedias, setIsShowMedias] = useState(false);

  return (
    <div className={cn(className, incoming && "justify-end")}>
      <DialogMedias
        open={isShowMedias}
        onOpenChange={setIsShowMedias}
        medias={medias}
      />
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
          <MediasGrid medias={medias} setIsShowMedias={setIsShowMedias} />
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

export default memo(Media);

const MediasGrid = ({ medias, setIsShowMedias }) => {
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
            "relative h-[150px] cursor-pointer",
            medias.length === 1 && "col-span-2 row-span-2",
            medias.length === 2 && "col-span-1 row-span-2",
            medias.length > 2 && "col-span-1 row-span-1"
          )}
          onClick={setIsShowMedias}
        >
          <img
            src={media.url}
            alt={media.filename}
            className="size-full object-cover"
          />
          {medias.length > 4 && idx === 3 && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center text-black text-2xl">
              {`+${medias.length - 3}`}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const DialogMedias = ({ open, onOpenChange, medias }) => {
  const handleDowloadAll = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const zip = new JSZip();

    for (let media of medias) {
      const name = media.url.split("/")[media.url.split("/").length - 1];
      const response = await fetch(media.url);
      const blod = await response.blob();

      zip.file(name, blod);
    }

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-none size-full bg-card/30 backdrop-blur-lg p-0 flex items-center justify-center"
        onClick={() => onOpenChange(false)}
      >
        <DialogHeader>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-0 right-0"
            title="Tải xuống toàn bộ"
            onClick={(e) => handleDowloadAll(e)}
          >
            <Download className="size-5" />
          </Button>
          <DialogTitle />
          <DialogDescription />
        </DialogHeader>
        <div
          className="h-full max-w-[500px] bg-primary-foreground rounded-lg overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <Carousel opts={{ align: "start" }} className="w-full rounded-2xl">
            <CarouselContent>
              {medias.map((m, idx) => (
                <CarouselItem key={idx} className={"w-full"}>
                  {m.type === "image" && (
                    <img
                      src={m.url}
                      alt="Attachment"
                      className="size-full object-cover"
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                  {m.type === "video" && (
                    <video
                      src={m.url}
                      controls
                      className="size-full object-contain"
                    />
                  )}
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </DialogContent>
    </Dialog>
  );
};
