import React from "react";
import { Carousel, CarouselContent, CarouselItem } from "../ui";
import { cn } from "@/lib/utils";

const MediaPreviews = ({ attachments, onOpenChange }) => {
  return (
    attachments.length > 0 && (
      <Carousel
        opts={{ align: "start" }}
        className="w-full overflow-hidden rounded-2xl"
      >
        <CarouselContent>
          {attachments.map((m, idx) => (
            <CarouselItem
              key={idx}
              className={cn(
                "w-full",
                attachments.length === 2 && "md:basis-1/2 lg:basis-1/2",
                attachments.length > 2 && "md:basis-1/2 lg:basis-1/3"
              )}
            >
              <MediaPreview media={m} onOpenChange={onOpenChange} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    )
  );
};

export default MediaPreviews;

const MediaPreview = ({ media, onOpenChange }) => {
  if (media.type === "IMAGE")
    return (
      <img
        src={media.url}
        alt="Attachment"
        className="mx-auto size-full max-h-[30rem] rounded-2xl object-cover cursor-pointer"
        onClick={onOpenChange}
      />
    );
  if (media.type === "VIDEO")
    return (
      <video
        src={media.url}
        controls
        className="mx-auto size-full max-h-[30rem] rounded-2xl"
      />
    );
};
