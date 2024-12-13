import icons from "@/lib/icons";
import { bytesToMB, cn } from "@/lib/utils";
import React, { memo, useRef, useState } from "react";
import { Button, ScrollArea } from "./ui";
import { toast } from "sonner";

const { Upload, Trash2, File } = icons;

const FileDrop = ({
  className,
  acceptedFiles = "image/*,video/*",
  setFiles,
  files,
  multiple,
}) => {
  const formRef = useRef(null);
  const heigthRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [previewFiles, setPreviewFiles] = useState([]);

  // Xử lý khi kéo thả file
  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragging(false);

    const filesArr = event.dataTransfer.files;
    if (filesArr.length > 0 && filesArr.length <= 10) {
      for (let file of filesArr) {
        const type = file.type.split("/")[0];
        const reader = new FileReader();
        reader.onload = () => {
          setFiles((prev) => [...prev, file]);
          setPreviewFiles((prev) => [...prev, { type, url: reader.result }]);
        };
        reader.readAsDataURL(file);
      }
    } else toast.warning("Số lượng file không được vượt quá 10.");
  };

  // Xử lý khi chọn file từ input
  const handleFileChange = (event) => {
    const filesArr = event.target.files;
    if (filesArr.length > 0 && filesArr.length <= 10) {
      for (let file of filesArr) {
        const type = file.type.split("/")[0];
        const reader = new FileReader();
        reader.onload = () => {
          setFiles((prev) => [...prev, file]);
          setPreviewFiles((prev) => [
            ...prev,
            { type, name: file.name, size: file.size, url: reader.result },
          ]);
        };
        reader.readAsDataURL(file);
      }
    } else toast.warning("Số lượng file không được vượt quá 10.");
  };

  // Sự kiện drag
  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  // Mở input chọn file
  const openFilePicker = () => formRef.current?.click();

  // Xóa ảnh
  const removeImage = (index) => {
    setFiles((prevImages) => prevImages.filter((_, i) => i !== index));
    setPreviewFiles((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <div className={cn(className)}>
      <form
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFilePicker}
        className={cn(previewFiles[0]?.type === "application" && "hidden")}
      >
        <div className="py-10 px-5 cursor-pointer">
          <div
            className={cn(
              "mb-2.5 flex border flex-col items-center justify-center space-y-3 p-5",
              dragging
                ? "border-dashed border-primary rounded-md transition-all"
                : "border-transparent"
            )}
          >
            <div className="shadow-md flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Upload className="size-5" />
              <input
                type="file"
                multiple={multiple}
                accept={acceptedFiles}
                ref={formRef}
                hidden
                onChange={handleFileChange}
              />
            </div>
            <span className="text-sm text-center cursor-default px-5">
              Kéo và thả tệp ảnh hoặc video vào đây hoặc click vào nút bấm để
              tải lên
            </span>
          </div>
        </div>
      </form>
      <div
        className={cn(
          heigthRef.current?.offsetHeight >= 500 && "h-[500px]",
          previewFiles.length === 0 && "hidden"
        )}
        ref={heigthRef}
      >
        {/* medias */}
        {previewFiles.length > 1 && (
          <div className="absolute -top-5 right-5 text-xs">{`Số lượng: ${files.length}/10`}</div>
        )}
        <ScrollArea className="h-full pb-10 px-5">
          <div
            className={cn(
              "grid gap-2",
              previewFiles.length === 1 && "grid-cols-1",
              previewFiles.length === 2 && "grid-cols-2",
              previewFiles.length === 3 && "grid-cols-3",
              previewFiles.length > 3 && "grid-cols-4"
            )}
          >
            {previewFiles.map((file, idx) => (
              <div className="col-span-1 relative" key={idx}>
                {file.type === "image" && (
                  <img
                    src={file.url}
                    alt={file.url}
                    className="size-full object-cover"
                  />
                )}
                {file.type === "video" && (
                  <video
                    src={file.url}
                    controls
                    className="size-full object-contain"
                  />
                )}
                {file.type === "application" && (
                  <div className="px-10 pt-10">
                    <div className="flex flex-row items-center justify-between p-2 bg-primary border rounded-md space-x-5 mb-2 text-primary-foreground">
                      <div className="flex flex-row items-center space-x-3">
                        <div className="p-2 rounded-md bg-primary border">
                          <File className="size-6" />
                        </div>
                        <div className="flex flex-col">
                          <span className="line-clamp-1">{file.name}</span>
                          <small className="font-medium opacity-50">
                            {`${bytesToMB(file.size)} MB`}
                          </small>
                        </div>
                      </div>
                      <div>
                        <Button
                          variant="outline"
                          size="icon"
                          className="bg-primary"
                          onClick={() => removeImage(idx)}
                        >
                          <Trash2 className="size-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                {file.type !== "application" && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-all bg-card/40">
                    <div
                      className="p-2 border-2 border-primary rounded-full w-fit hover:bg-muted/40 transition-none cursor-pointer"
                      onClick={() => removeImage(idx)}
                    >
                      <Trash2 className="size-5 font-medium" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default memo(FileDrop);
