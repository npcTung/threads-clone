import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Input,
  Label,
  LoadingButton,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "..";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserProfileSchema } from "@/lib/validation";
import Resizer from "react-image-file-resizer";
import icons from "@/lib/icons";
import avatarPlaceholder from "@/assets/avatar-placeholder.png";
import CropImageDialog from "./CropImageDialog";

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
    console.log(data);
    onOpenChange();
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
          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Tên..."
                    {...field}
                    className={"bg-muted w-full"}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Link..."
                    {...field}
                    className={"bg-muted"}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giới tính</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    name={field.name}
                  >
                    <SelectTrigger className="w-full bg-muted">
                      <SelectValue placeholder="<-- Chọn giới tính -->" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Giới tính</SelectLabel>
                        {optionGenders.map((el, idx) => (
                          <SelectItem key={idx} value={el.value}>
                            {el.title}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tiểu sử</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tiểu sử..."
                    {...field}
                    className={"bg-muted resize-none"}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <LoadingButton type="sumbit" className={"w-full"}>
            Xong
          </LoadingButton>
        </form>
      </Form>
    </div>
  );
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
