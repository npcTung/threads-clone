import useCurrentStore from "@/zustand/useCurrentStore";
import * as apis from "@/apis";
import { useState } from "react";
import { toast } from "sonner";

const useCurrentData = () => {
  const { setCurrentData, setIsLoggedIn } = useCurrentStore();

  const getCurrentData = async () => {
    try {
      const response = await apis.getCurrent();
      if (response.success) setCurrentData(response.data);
    } catch (error) {
      setIsLoggedIn(false);
      console.error(error.message);
    }
  };

  return { getCurrentData };
};

export default useCurrentData;

export const useUpdateUserProfile = () => {
  const { setCurrentData } = useCurrentStore();
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const updateUserProfile = async (data) => {
    setIsPending(true);
    try {
      const { avatar, ...payload } = data;
      const updatedUser = await apis.updateUserProfile(payload);
      if (updatedUser.success) {
        setCurrentData(updatedUser.data);
        toast.success(updatedUser.mes);
      }
      if (avatar) {
        const formData = new FormData();
        formData.append("avatar", avatar);
        const updatedAvatar = await apis.updateAvatar(formData);
        if (updatedAvatar.success) {
          setCurrentData(updatedAvatar.data);
          toast.success(updatedAvatar.mes);
        }
      }
      setIsSuccess(true);
    } catch (error) {
      setIsSuccess(false);
      console.error(error.message);
    } finally {
      setIsPending(false);
    }
  };

  return { isSuccess, isPending, updateUserProfile };
};

export const useFollowUser = () => {
  const { setCurrentData } = useCurrentStore();

  const followUser = async (userId) => {
    try {
      const followedUser = await apis.followUser(userId);
      if (followedUser.success) {
        setCurrentData(followedUser.data);
        toast.success(followedUser.mes);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return { followUser };
};

export const useBookmarkPostUser = () => {
  const { setCurrentData } = useCurrentStore();

  const bookmarkPostUser = async (postId) => {
    try {
      const bookmarkPost = await apis.bookmark_unbookmark(postId);
      if (bookmarkPost.success) {
        setCurrentData(bookmarkPost.data);
        toast.success(bookmarkPost.mes);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return { bookmarkPostUser };
};
