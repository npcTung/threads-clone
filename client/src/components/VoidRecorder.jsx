import React from "react";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";

const VoidRecorder = ({ open, onOpenChange }) => {
  const recorderControls = useAudioRecorder(
    {
      noiseSuppression: true,
      echoCancellation: true,
    },
    (err) => console.error(err.message)
  );

  const addAudioElement = (blod) => {
    const url = URL.createObjectURL(blod);

    const audio = document.createElement("audio");
    audio.src = url;
    audio.controls = true;

    const targetContainer = document.getElementById("audio-container");
    targetContainer.appendChild(audio);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle />
          <DialogDescription />
        </DialogHeader>
        <div className="size-full space-y-8">
          <div
            id="audio-container"
            className="flex flex-col space-y-8 items-center"
          >
            <AudioRecorder
              showVisualizer={true}
              onRecordingComplete={(blod) => addAudioElement(blod)}
              recorderControls={recorderControls}
              downloadOnSavePress={true}
              downloadFileExtension="mp3"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" className="w-full">
              Gửi
            </Button>
            <DialogClose className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2">
              Hủy
            </DialogClose>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VoidRecorder;
