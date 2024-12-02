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
  InfiniteScrollContainer,
  LoadingScreen,
  NotFound,
  Post,
  ScrollArea,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  UserAvatar,
  UserTooltip,
} from "@/components";
import { countryAddress } from "@/data";
import React, { useEffect, useState } from "react";
import femaleIcon from "@/assets/female-icon.svg";
import maleIcon from "@/assets/male-icon.svg";
import icons from "@/lib/icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import { formatDate } from "date-fns";
import { vi } from "date-fns/locale";
import * as apis from "@/apis";
import { toast } from "sonner";
import useCurrentStore from "@/zustand/useCurrentStore";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchGetUser, fetchGetUserPosts } from "./actions";
import path from "@/lib/path";

const { CircleEllipsis, Link2, Info, UserX, Dot, LoaderCircle } = icons;

const User = () => {
  const { currentData } = useCurrentStore();
  const { user_name } = useParams();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", user_name],
    queryFn: () => fetchGetUser(user_name),
    staleTime: 5000,
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["posts", user_name],
    queryFn: ({ pageParam }) => fetchGetUserPosts(user_name, pageParam),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 5000,
  });

  const userPosts = data?.pages.flatMap((page) => page.posts) || [];

  if (isLoading || status === "pending") return <LoadingScreen />;
  if (error) return <NotFound />;

  return (
    <div className="max-w-[720px] w-full mx-auto mb-10 border space-y-5 md:rounded-2xl bg-card">
      <UserHeader
        userData={user?._id === currentData._id ? currentData : user}
        isEdit={user?._id === currentData?._id}
        currentData={currentData}
      />
      <InfiniteScrollContainer
        onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
      >
        {userPosts.map((post, idx) => (
          <Post
            key={idx}
            className={idx !== userPosts.length - 1 && "border-b"}
            data={post}
            isEdit={user?._id === currentData?._id}
          />
        ))}
        {status === "success" && !userPosts.length && !hasNextPage && (
          <div className="p-5 flex items-center justify-center">
            <span>Không có bài viết nào</span>
          </div>
        )}
        {isFetchingNextPage && (
          <LoaderCircle className="mx-auto size-5 animate-spin" />
        )}
      </InfiniteScrollContainer>
    </div>
  );
};

export default User;

const UserHeader = ({ userData, isEdit, currentData }) => {
  const [showAvatar, setShowAvatar] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [showFollow, setShowFollow] = useState(false);
  const followingId = currentData.following.map((followId) => followId._id);
  const navigate = useNavigate();

  return (
    <>
      {/* show avatar */}
      <DialogFullAvatar
        userData={userData}
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
      {/* show follower following */}
      <DialogFollowerFollowing
        open={showFollow}
        onOpenChange={setShowFollow}
        data={userData?._id === currentData._id ? currentData : userData}
      />
      <div className="border-b p-5 space-y-5">
        <div className="flex w-full flex-col gap-3 break-words px-1 py-2.5 md:min-w-52">
          <div className="flex items-center justify-between gap-20">
            <div>
              <span
                className="text-lg font-semibold hover:underline cursor-pointer"
                onClick={() => setShowInfo(true)}
              >
                {userData?.displayName}
              </span>
              <small className="flex items-center gap-1 text-muted-foreground">
                @{userData?.userName}{" "}
                {userData?.gender === "female" && (
                  <img
                    src={femaleIcon}
                    alt={`${userData?.gender} icon`}
                    className="size-4"
                  />
                )}
                {userData?.gender === "male" && (
                  <img
                    src={maleIcon}
                    alt={`${userData?.gender} icon`}
                    className="size-4"
                  />
                )}
              </small>
            </div>
            <UserAvatar
              avatarUrl={userData?.avatarUrl}
              displayName={userData?.displayName}
              className={"cursor-pointer size-28"}
              handelOnclick={() => setShowAvatar(true)}
            />
          </div>
          {userData?.bio && (
            <div className="line-clamp-4 whitespace-pre-line">
              {userData?.bio}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <FollowerCount
              className={"text-sm opacity-50"}
              follower={userData?.follower.length}
              handelOnclick={() => setShowFollow(true)}
            />
            {userData?.link && (
              <>
                <Dot className="opacity-50" />
                <Link
                  to={userData?.link}
                  target="_blank"
                  className={
                    "text-sm opacity-50 hover:underline whitespace-nowrap"
                  }
                >
                  {userData?.link}
                </Link>
              </>
            )}
          </div>
          {isEdit ? <></> : <DropMenu onOpenChange={() => setShowInfo(true)} />}
        </div>
        {isEdit ? (
          <Button
            variant="outline"
            className="w-full text-md"
            onClick={() => setShowEditUser(true)}
          >
            Chỉnh sửa trang cá nhân
          </Button>
        ) : (
          <div className="flex items-center gap-5">
            <FollowButton
              className={"flex-1"}
              isFollow={followingId.includes(userData._id)}
              userId={userData._id}
            />
            <Button
              variant={"outline"}
              className={"flex-1"}
              onClick={() => navigate(`/${path.MESSAGER}/1`)}
            >
              Nhắn tin
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

const DropMenu = ({ onOpenChange }) => {
  const copyUrl = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Đã sao chép url của người dùng.");
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
          <Link2 className="size-5 -rotate-45" />
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

const DialogFullAvatar = ({ userData, open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="size-full flex items-center max-w-none justify-center bg-card/30 backdrop-blur-lg"
        onClick={onOpenChange}
      >
        <DialogHeader>
          <DialogTitle />
          <DialogDescription />
        </DialogHeader>
        <UserAvatar
          avatarUrl={userData?.avatarUrl}
          displayName={userData?.displayName}
          className="size-64"
        />
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
      const response = await apis.ipAddress(import.meta.env.VITE_IP_TOKEN);
      const { city, country, postal } = response.data;
      setLocation({ city, country, postal });
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader className={"p-0"}>
        <DialogTitle></DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <DialogContent className="w-[400px]">
        <div className="flex items-center justify-between space-x-5">
          <div className="flex flex-col w-full space-y-1 border-b pb-2">
            <span className="font-semibold">Tên</span>
            <span className="text-sm">{`${userData?.displayName} (@${userData?.userName})`}</span>
          </div>
          <UserAvatar avatarUrl={userData?.avatarUrl} size={50} />
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

const DialogFollowerFollowing = ({ open, onOpenChange, data }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle />
        <DialogDescription />
      </DialogHeader>
      <DialogContent className="max-h-[70%]">
        <Tabs defaultValue="follower">
          <TabsList className={"w-full flex gap-5"}>
            <TabsTrigger value="follower" className="flex-1">
              Người theo dõi
            </TabsTrigger>
            <TabsTrigger value="following" className="flex-1">
              Đang theo dõi
            </TabsTrigger>
          </TabsList>
          <ScrollArea className="w-full h-[80%]">
            <TabsContent value="follower">
              {data.follower.length > 0 ? (
                data.follower.map((follow) => (
                  <UserPreview key={follow._id} data={follow} />
                ))
              ) : (
                <span className="text-center w-full flex items-center justify-center p-5">
                  Không có người theo dõi
                </span>
              )}
            </TabsContent>
            <TabsContent value="following">
              {data.following.length > 0 ? (
                data.following.map((follow) => (
                  <UserPreview key={follow._id} data={follow} />
                ))
              ) : (
                <span className="text-center w-full flex items-center justify-center p-5">
                  Không theo dõi ai
                </span>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

const UserPreview = ({ data }) => {
  return (
    <div className={"w-full flex items-center justify-between p-5"}>
      <div className="flex gap-3 w-full">
        <div className="flex flex-col items-center">
          <Link to={`/${data.userName}`}>
            <UserAvatar avatarUrl={data.avatarUrl} />
          </Link>
        </div>
        <Link to={`/${data.userName}`} className="w-full">
          <div className="flex-1 w-full space-y-5 border-b pb-2">
            <div className="flex flex-col">
              <div className="flex justify-between w-full">
                <div className="flex w-full items-center">
                  <span className="text-sm font-medium hover:underline">
                    {data.userName}
                  </span>
                </div>
              </div>
              <span className="text-sm opacity-50">{data.displayName}</span>
            </div>
            <FollowerCount
              className={"text-sm"}
              follower={data.follower.length}
            />
          </div>
        </Link>
      </div>
    </div>
  );
};
