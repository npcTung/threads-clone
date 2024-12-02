import icons from "@/lib/icons";
import { cn } from "@/lib/utils";
import Dropzone from "dropzone";
import React, { memo, useEffect, useRef } from "react";
import "dropzone/dist/dropzone.css";

const { Upload } = icons;

const FileDropZone = ({
  className,
  acceptedFiles = "image/*,video/*",
  maxFileSize = 16 * 1024 * 1024,
  url = "/file/post",
}) => {
  const dropzoneRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    Dropzone.autoDiscover = false;

    if (!dropzoneRef.current && formRef.current) {
      dropzoneRef.current = new Dropzone(formRef.current, {
        url,
        acceptedFiles,
        maxFiles: maxFileSize / (1024 * 1024),
      });
    }

    return () => {
      if (dropzoneRef.current) {
        dropzoneRef.current.destroy();
        dropzoneRef.current = null;
      }
    };
  }, []);

  return (
    <div className={cn(className)}>
      <form
        action={url}
        ref={formRef}
        id="upload"
        className="dropzone rounded-md cursor-pointer"
      >
        <div className="dz-message">
          <div className="mb-2.5 flex flex-col items-center justify-center space-y-3">
            <div className="shadow-md flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Upload className="size-5" />
            </div>
            <span className="text-sm text-center cursor-default px-5">
              Kéo và thả tệp ảnh hoặc video vào đây hoặc click vào nút bấm để
              tải lên
            </span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default memo(FileDropZone);
