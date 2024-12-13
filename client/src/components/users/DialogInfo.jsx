import React, { useEffect, useState } from "react";
import { getIpAddress } from "./actions";
import { countryAddress } from "@/data";
import { formatDate } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui";
import { UserAvatar } from "..";
import icons from "@/lib/icons";
import { vi } from "date-fns/locale";

const { Dot } = icons;

const DialogInfo = ({ userData, open, onOpenChange }) => {
  const [location, setLocation] = useState({
    city: "",
    country: "",
    postal: "",
  });

  const fetchIpAddress = async () => {
    const response = await getIpAddress();
    if (response) setLocation(response);
  };

  useEffect(() => {
    fetchIpAddress();
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader className={"p-0"}>
        <DialogTitle />
        <DialogDescription />
      </DialogHeader>
      <DialogContent className="w-[400px]">
        <div className="flex items-center justify-between space-x-5">
          <div className="flex flex-col w-full space-y-1 border-b pb-2">
            <span className="font-semibold">Tên</span>
            <span className="text-sm">{`${userData?.displayName} (@${userData?.userName})`}</span>
          </div>
          <UserAvatar
            avatarUrl={userData?.avatarUrl}
            displayName={userData.displayName}
            className={"size-[80px]"}
          />
        </div>
        <div className="flex flex-col py-2 border-b">
          <span className="font-semibold">Ngày tham gia</span>
          {userData?.createdAt && (
            <span className="text-sm">
              {formatDate(userData?.createdAt, "EEEE, d MMMM, yyyy", {
                locale: vi,
              })}
            </span>
          )}
        </div>
        <div className="flex flex-col py-2">
          <span className="font-semibold">Địa điểm</span>
          <div className="text-sm flex items-center">
            <span>{location.city}</span>
            <Dot />
            <span>
              {
                countryAddress.find(
                  (el) => el.abbreviation === location.country
                )?.country
              }
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogInfo;
