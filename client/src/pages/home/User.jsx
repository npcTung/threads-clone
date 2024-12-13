import {
  Button,
  DialogCreateMessageToUser,
  DialogEditUser,
  DialogFollowerFollowing,
  DialogFullAvatar,
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
  UserAvatar,
} from "@/components";
import React, { useState } from "react";
import femaleIcon from "@/assets/female-icon.svg";
import maleIcon from "@/assets/male-icon.svg";
import icons from "@/lib/icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import useCurrentStore from "@/zustand/useCurrentStore";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchGetUser, fetchGetUserPosts, getConversation } from "./actions";
import path from "@/lib/path";
import DialogInfo from "@/components/users/DialogInfo";
import { useBlockAccount } from "@/hooks/useCurrentData";

const { CircleEllipsis, Link2, Info, UserX, Dot, LoaderCircle } = icons;

const User = () => {
  const { currentData } = useCurrentStore();
  const { user_name } = useParams();

  if (currentData.blockedUsers.map((el) => el.userName).includes(user_name))
    return <NotFound />;

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user", user_name],
    queryFn: () => fetchGetUser(user_name),
    staleTime: 5000,
  });

  if (isError) return <NotFound />;

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

  return (
    <div className="max-w-[720px] w-full mx-auto mb-10 border space-y-5 md:rounded-2xl bg-card">
      <UserHeader
        userData={user?._id === currentData._id ? currentData : user}
        isEdit={user?._id === currentData?._id}
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

const UserHeader = ({ userData, isEdit }) => {
  const [showAvatar, setShowAvatar] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [showFollow, setShowFollow] = useState(false);
  const [isShowCreateMessage, setIsShowCreateMessage] = useState(false);
  const { currentData } = useCurrentStore();
  const followingId = currentData.following.map((followId) => followId._id);
  const navigate = useNavigate();

  const handleMessage = async () => {
    const conversation = await getConversation(userData._id);
    if (conversation) {
      navigate(`/${path.MESSAGER}`);
    } else setIsShowCreateMessage(true);
  };

  return (
    <>
      {/* show avatar */}
      <DialogFullAvatar
        userData={userData}
        open={showAvatar}
        onOpenChange={setShowAvatar}
      />
      {/* show info */}
      <DialogInfo
        userData={userData}
        onOpenChange={setShowInfo}
        open={showInfo}
      />
      {/* show edit user */}
      <DialogEditUser
        data={userData}
        onOpenChange={setShowEditUser}
        open={showEditUser}
      />
      {/* show follower following */}
      <DialogFollowerFollowing
        open={showFollow}
        onOpenChange={setShowFollow}
        data={userData?._id === currentData._id ? currentData : userData}
      />
      {/* show create message to user */}
      <DialogCreateMessageToUser
        open={isShowCreateMessage}
        onOpenChange={setIsShowCreateMessage}
        recipientId={userData._id}
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
          {!isEdit && (
            <DropMenu
              onOpenChange={() => setShowInfo(true)}
              uid={userData._id}
            />
          )}
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
              onClick={handleMessage}
            >
              Nhắn tin
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

const DropMenu = ({ onOpenChange, uid }) => {
  const blockUser = useBlockAccount();

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
        <DropdownMenuItem
          className="flex items-center justify-between gap-5 cursor-pointer py-3 text-red-600"
          onClick={() => blockUser.blockAccount(uid)}
        >
          <span>Chặn</span>
          <UserX className="size-5" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
