import React, { useState } from "react";
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
import { LoadingButton } from ".";
import { useSendMessageAudioMutation } from "./chats/mutation";
import icons from "@/lib/icons";

const { File } = icons;

const VoidRecorder = ({ open, onOpenChange, recipientId }) => {
  const [audio, setAudio] = useState("");
  const [urlAudio, setUrlAudio] = useState(null);
  const mutation = useSendMessageAudioMutation();

  const recorderControls = useAudioRecorder(
    {
      noiseSuppression: true,
      echoCancellation: true,
    },
    (err) => console.error(err.message)
  );

  const addAudioElement = (blod) => {
    const reader = new FileReader();
    reader.onload = () => setUrlAudio(reader.result);
    reader.readAsDataURL(blod);
    setAudio(blod);
  };

  const handleSumbit = () => {
    const payload = { audio, recipientId };
    mutation.mutate(payload, { onSuccess: onClose });
  };

  const onClose = () => {
    setAudio("");
    setUrlAudio(null);
    onOpenChange(false);
    recorderControls.stopRecording();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle />
          <DialogDescription />
        </DialogHeader>
        <div className="size-full space-y-8">
          <div
            id="audio-container"
            className="flex space-x-8 w-full items-center justify-between"
          >
            <div className="w-full flex items-center justify-center">
              <AudioRecorder
                showVisualizer={true}
                onRecordingComplete={(blod) => addAudioElement(blod)}
                recorderControls={recorderControls}
                // downloadOnSavePress={true}
                // downloadFileExtension="mp3"
              />
            </div>
            <Button size="icon" title={"Chọn tệp âm thanh từ máy."}>
              <label htmlFor="audio" className="cursor-pointer">
                <File className="size-5" />
                <input
                  type="file"
                  id="audio"
                  hidden
                  accept=".mp3,.wav,.ogg,.aac,.flac,.m4a,.wma"
                  onChange={(e) => addAudioElement(e.target.files[0])}
                />
              </label>
            </Button>
          </div>
          {urlAudio && <audio src={urlAudio} controls className="w-full" />}
        </div>
        <DialogFooter>
          <LoadingButton
            onClick={handleSumbit}
            loading={mutation.isPending}
            disabled={mutation.isPending || audio === ""}
            variant="outline"
            className="w-full"
          >
            Gửi
          </LoadingButton>
          <DialogClose asChild>
            <Button variant="destructive" className="w-full">
              Hủy
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VoidRecorder;
