import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui";

const DialogMedias = ({ attachments, open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={
          "max-w-none size-full flex items-center justify-center bg-card/30 backdrop-blur-lg"
        }
      >
        <DialogHeader>
          <DialogTitle />
          <DialogDescription />
        </DialogHeader>
        <Carousel opts={{ align: "start" }} className="w-full rounded-2xl">
          <CarouselContent onClick={onOpenChange}>
            {attachments.map((m, idx) => (
              <CarouselItem key={idx} className={"w-full"}>
                <img
                  src={m.url}
                  alt="Attachment"
                  className="mx-auto size-[99%] max-w-[500px] rounded-2xl object-contain"
                  onClick={(e) => e.stopPropagation()}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </DialogContent>
    </Dialog>
  );
};

export default DialogMedias;