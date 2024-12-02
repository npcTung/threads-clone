import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Form,
  FormInput,
  FormSelect,
  FormTextarea,
  Label,
  LoadingButton,
} from "..";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserProfileSchema } from "@/lib/validation";
import Resizer from "react-image-file-resizer";
import icons from "@/lib/icons";
import avatarPlaceholder from "@/assets/avatar-placeholder.png";
import CropImageDialog from "./CropImageDialog";
import PropTypes from "prop-types";
import { useUpdateUserProfile } from "@/hooks/useCurrentData";

const { Camera } = icons;

const optionGenders = [
  { title: "Male", value: "male" },
  { title: "Female", value: "female" },
];

const DialogEditUser = ({ data, open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={"max-sm:size-full max-sm:max-w-none"}>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa trang cá nhân</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <EditUserProfile userData={data} onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>
  );
};

export default DialogEditUser;

const EditUserProfile = ({ userData, onOpenChange }) => {
  const [croppedAvatar, setCroppedAvatar] = useState(null);
  const updateUser = useUpdateUserProfile();

  const form = useForm({
    resolver: zodResolver(updateUserProfileSchema),
    defaultValues: {
      displayName: userData.displayName || "",
      bio: userData.bio || "",
      gender: userData.gender || "",
      link: userData.link || "",
    },
  });

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      avatar: croppedAvatar
        ? new File([croppedAvatar], `avatar_${userData._id}.jpg`)
        : null,
    };
    updateUser.updateUserProfile(payload);
    onOpenChange(!updateUser.isSuccess);
  };

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <Label>Avatar</Label>
        <AvatarInput
          onImageCropped={setCroppedAvatar}
          src={
            croppedAvatar
              ? URL.createObjectURL(croppedAvatar)
              : userData.avatarUrl || avatarPlaceholder
          }
        />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormInput
            form={form}
            lable="Tên"
            name="displayName"
            placeholder="Tên..."
            className="bg-muted"
          />
          <FormInput
            form={form}
            lable="Link"
            name="link"
            placeholder="Link..."
            className="bg-muted"
          />
          <FormSelect
            form={form}
            lable="Giới tính"
            name="gender"
            placeholder="<-- Chọn giới tính -->"
            options={optionGenders}
          />
          <FormTextarea
            form={form}
            lable="Tiểu sử"
            name="bio"
            placeholder="Tiểu sử..."
            className="bg-muted min-h-[100px] max-h-[200px]"
          />
          <LoadingButton
            loading={updateUser.isPending}
            type="sumbit"
            className={"w-full"}
          >
            Xong
          </LoadingButton>
        </form>
      </Form>
    </div>
  );
};

EditUserProfile.prototype = {
  userData: PropTypes.shape({
    displayName: PropTypes.string,
    bio: PropTypes.string,
    gender: PropTypes.string,
    link: PropTypes.string,
    avatarUrl: PropTypes.string,
  }),
  onOpenChange: PropTypes.func.isRequired,
};

const AvatarInput = ({ src, onImageCropped }) => {
  const [imageToCrop, setImageToCrop] = useState();
  const fileInputRef = useRef(null);

  const onImageSelect = (image) => {
    if (!image) return;

    Resizer.imageFileResizer(
      image,
      1024,
      1024,
      "WEBP",
      100,
      0,
      (uri) => setImageToCrop(uri),
      "file"
    );
  };

  return (
    <>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => onImageSelect(e.target?.files?.[0])}
        ref={fileInputRef}
        hidden
        className="sr-only"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="group relative block"
      >
        <img
          src={src}
          alt="Avatar preview"
          width={150}
          height={150}
          className="size-32 flex-none rounded-full object-cover"
        />
        <span className="absolute inset-0 m-auto flex size-12 items-center justify-center rounded-full bg-black bg-opacity-30 text-white transition-colors duration-200 group-hover:bg-opacity-25">
          <Camera />
        </span>
      </button>
      {imageToCrop && (
        <CropImageDialog
          src={URL.createObjectURL(imageToCrop)}
          cropAspacetRatio={1}
          onCropped={onImageCropped}
          onClose={() => {
            setImageToCrop(undefined);
            if (fileInputRef.current) fileInputRef.current.value = "";
          }}
        />
      )}
    </>
  );
};

AvatarInput.prototype = {
  src: PropTypes.string.isRequired,
  onImageCropped: PropTypes.func.isRequired,
};
