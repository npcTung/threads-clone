import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogEditUser,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  FollowButton,
  FollowerCount,
  Post,
  UserAvatar,
} from "@/components";
import { countryAddress, dataPosts, user } from "@/data";
import React, { useEffect, useState } from "react";
import femaleIcon from "@/assets/female-icon.svg";
import maleIcon from "@/assets/male-icon.svg";
import icons from "@/lib/icons";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { formatDate } from "date-fns";
import { vi } from "date-fns/locale";
import * as apis from "@/apis";

const { CircleEllipsis, Link2, Info, UserX, Dot } = icons;

const User = () => {
  return (
    <div className="w-[720px] mx-auto my-10 border min-h-full space-y-5 md:rounded-2xl">
      <UserHeader userData={user} />
      {dataPosts.map((post, idx) => (
        <Post
          key={post.id}
          className={idx !== Array(20).length - 1 && "border-b"}
          data={post}
        />
      ))}
    </div>
  );
};

export default User;

const UserHeader = ({ userData }) => {
  const [showAvatar, setShowAvatar] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);

  return (
    <>
      {/* show avatar */}
      <DialogFullAvatar
        avatarUrl={user.avatarUrl}
        open={showAvatar}
        onOpenChange={() => setShowAvatar(false)}
      />
      {/* show info */}
      <DialogInfo
        userData={userData}
        onOpenChange={() => setShowInfo(false)}
        open={showInfo}
      />
      {/* show edit user */}
      <DialogEditUser
        data={userData}
        onOpenChange={() => setShowEditUser(false)}
        open={showEditUser}
      />
      <div className="border-b p-5 space-y-5">
        <div className="flex w-full flex-col gap-3 break-words px-1 py-2.5 md:min-w-52">
          <div className="flex items-center justify-between gap-20">
            <div>
              <span
                className="text-lg font-semibold hover:underline cursor-pointer"
                onClick={() => setShowInfo(true)}
              >
                {userData.displayName}
              </span>
              <small className="flex items-center gap-1 text-muted-foreground">
                @{userData.userName}{" "}
                {userData.gender === "female" && (
                  <img
                    src={femaleIcon}
                    alt={`${userData.gender} icon`}
                    className="size-4"
                  />
                )}
                {userData.gender === "male" && (
                  <img
                    src={maleIcon}
                    alt={`${userData.gender} icon`}
                    className="size-4"
                  />
                )}
              </small>
            </div>
            <UserAvatar
              avatarUrl={userData.avatarUrl}
              displayName={userData.displayName}
              size={100}
              className={"cursor-pointer"}
              handelOnclick={() => setShowAvatar(true)}
            />
          </div>
          {user.bio && (
            <div className="line-clamp-4 whitespace-pre-line">
              {userData.bio}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <FollowerCount
              className={"text-sm opacity-50"}
              // userId={user.id}
              // initialState={followerState}
            />
            <Dot className="opacity-50" />
            <Link
              to={user.link}
              target="_blank"
              className={"text-sm opacity-50 hover:underline whitespace-nowrap"}
            >
              {user.link}
            </Link>
          </div>
          {true ? <></> : <DropMenu onOpenChange={() => setShowInfo(true)} />}
        </div>
        {true ? (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowEditUser(true)}
          >
            Chỉnh sửa trang cá nhân
          </Button>
        ) : (
          <div className="flex items-center gap-5">
            {/* {loggedInUser.id !== user.id && ( */}
            <FollowButton
              className={"flex-1"}
              // userId={user.id}
              // initialState={followerState}
            />
            {/* )} */}
            <Button variant={"outline"} className={"flex-1"}>
              Nhắn tin
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

const DropMenu = ({ onOpenChange }) => {
  const { toast } = useToast();

  const copyUrl = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      toast({
        variant: "default",
        title: "Successfully copied.",
        description: "User copyed url.",
        duration: 3000,
        className: "bg-green-600 text-white border-green-600",
      });
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <CircleEllipsis className="p-1 rounded-full hover:bg-muted size-8 cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end">
        <DropdownMenuItem
          className="flex items-center justify-between gap-5 cursor-pointer py-3"
          onClick={copyUrl}
        >
          <span>Sao chép liên kết</span>
          <Link2 className="size-5" />
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center justify-between gap-5 cursor-pointer py-3"
          onClick={onOpenChange}
        >
          <span>Giới thiệu về trang cá nhân này</span>
          <Info className="size-5" />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center justify-between gap-5 cursor-pointer py-3 text-red-600">
          <span>Chặn</span>
          <UserX className="size-5" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const DialogFullAvatar = ({ avatarUrl, open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="size-full flex items-center max-w-none justify-center bg-card/30 backdrop-blur-lg"
        onClick={onOpenChange}
      >
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <UserAvatar avatarUrl={avatarUrl} size={250} />
      </DialogContent>
    </Dialog>
  );
};

const DialogInfo = ({ userData, open, onOpenChange }) => {
  const [location, setLocation] = useState({
    city: "",
    country: "",
    postal: "",
  });

  const getLocation = async () => {
    try {
      const response = await apis.ipAddress();
      const { city, country, postal } = response.data;
      setLocation({ city, country, postal });
    } catch (error) {
      console.error("Error fetching location: ", error);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[400px]">
        <DialogHeader className={"p-0"}>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-between space-x-5">
          <div className="flex flex-col w-full space-y-1 border-b pb-2">
            <span className="font-semibold">Tên</span>
            <span className="text-sm">{`${userData.displayName} (@${userData.userName})`}</span>
          </div>
          <UserAvatar avatarUrl={userData.avatarUrl} size={50} />
        </div>
        <div className="flex flex-col py-2 border-b">
          <span className="font-semibold">Ngày tham gia</span>
          <span className="text-sm">
            {formatDate(userData.createdAt, "EEEE, d MMMM, yyyy", {
              locale: vi,
            })}
          </span>
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
