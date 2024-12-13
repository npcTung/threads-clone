import React, { memo, useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { cn } from "@/lib/utils";
import { Button } from "./ui";
import icons from "@/lib/icons";

const { Play, Pause } = icons;

const Waveform = (props) => {
  const { incoming, audioUrl } = props;
  const waveformRef = useRef();
  const [wavesurfer, setWavesurfer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handlePlayPause = () => {
    if (wavesurfer) {
      if (isPlaying) {
        wavesurfer.pause();
      } else {
        wavesurfer.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    if (waveformRef.current) {
      const ws = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#3c50e0",
        progressColor: "#80caee",
        url: audioUrl,
        renderFunction: (channels, ctx) => {
          const { width, height } = ctx.canvas;
          const scale = channels[0].length / width;
          const step = 6;

          ctx.translate(0, height / 2);
          ctx.strokeStyle = ctx.fillStyle;
          ctx.beginPath();

          for (let i = 0; i < width; i += step * 2) {
            const index = Math.floor(i * scale);
            const value = Math.abs(channels[0][index]);
            let x = i;
            let y = value * height;

            ctx.moveTo(x, 0);
            ctx.lineTo(x, y);
            ctx.arc(x + step / 2, y, step / 2, Math.PI, 0, true);
            ctx.lineTo(x + step, 0);

            x = x + step;
            y = -y;
            ctx.moveTo(x, 0);
            ctx.lineTo(x, y);
            ctx.arc(x + step / 2, y, step / 2, Math.PI, 0, false);
            ctx.lineTo(x + step, 0);
          }

          ctx.stroke();
          ctx.closePath();
        },
      });

      ws.on("ready", () => {
        const totalDuration = ws.getDuration();
        setDuration(formatTime(totalDuration));
      });

      ws.on("audioprocess", () => {
        const currentTime = ws.getCurrentTime();
        setCurrentTime(formatTime(currentTime));
      });

      ws.on("finish", () => {
        setIsPlaying(false);
        setCurrentTime(formatTime());
      });

      setWavesurfer(ws);

      return () => {
        ws.destroy();
      };
    }
  }, []);

  return (
    <div
      className={cn(
        "flex flex-row items-center space-x-6 rounded-md border p-2",
        !incoming && "bg-primary"
      )}
    >
      <Button
        variant="outline"
        size="icon"
        onClick={handlePlayPause}
        className="bg-primary text-primary-foreground rounded-full size-14"
      >
        {isPlaying ? (
          <Pause className="size-8 fill-inherit" />
        ) : (
          <Play className="size-8 fill-inherit" />
        )}
      </Button>

      <div className="grow flex flex-col space-y-1">
        <div
          className="w-full !z-0"
          ref={waveformRef}
          style={{ overflow: "hidden" }}
        />
        <span className="text-sm text-primary-foreground">{`${currentTime} / ${duration}`}</span>
      </div>
    </div>
  );
};

export default memo(Waveform);
