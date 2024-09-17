import React, { useRef } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui";
import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css";

const CropImageDialog = ({ src, cropAspacetRatio, onCropped, onClose }) => {
  const croppRef = useRef(null);
  const crop = () => {
    const cropper = croppRef.current?.cropper;

    if (!cropper) return;

    cropper.getCroppedCanvas().toBlob((blob) => onCropped(blob), "image/webp");
    onClose();
  };
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa hình ảnh</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <Cropper
          src={src}
          aspectRatio={cropAspacetRatio}
          guides={false}
          zoomable={false}
          ref={croppRef}
          className="mx-auto size-fit"
        />
        <DialogFooter>
          <Button variant={"secondary"} onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={crop}>Chỉnh sửa</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CropImageDialog;
