import { cn, formatRelativeDate } from "@/lib/utils";
import React, { useState, useRef, useEffect } from "react";
import {
  AudioVideoRoom,
  Button,
  Divider,
  DocumentPicker,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Giphy,
  Input,
  LoadingButton,
  MediaPicker,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollArea,
  Skeleton,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  // TypingIndicator,
  UserAvatar,
  useTheme,
  VoidRecorder,
} from "..";
import useCurrentStore from "@/zustand/useCurrentStore";
import icons from "@/lib/icons";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import {
  DocumentMessage,
  GiphyMessage,
  MediaMessage,
  TextMessage,
  VoiceMessage,
} from "../messages";
import { getAllMessages } from "./actions";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useSendMessageMutation } from "./mutation";
import { useInView } from "react-intersection-observer";
import { socket } from "@/lib/socketConfig";
import useConversationStore from "@/zustand/useConversationStore";

const {
  Phone,
  Video,
  Info,
  SendHorizontal,
  Link2,
  Smile,
  Mic,
  Image,
  File,
  TriangleAlert,
  LoaderCircle,
  ArrowLeft,
} = icons;

const MessageInbox = ({ className }) => {
  const { conversation } = useConversationStore();
  const queryClient = useQueryClient();
  const queryKey = ["messages", conversation._id];

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: ({ pageParam }) => getAllMessages(conversation._id, pageParam),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    staleTime: 5000,
  });

  const messages = data?.pages.flatMap((page) => page.messages).reverse() || [];

  const { ref } = useInView({
    rootMargin: "200px",
    onChange: (inView) => {
      if (inView) {
        if (hasNextPage && !isFetching) fetchNextPage();
      }
    },
  });

  useEffect(() => {
    socket.on("new-message", (data) => {
      queryClient.setQueryData([queryKey], (oldData) => {
        const firstPage = oldData?.pages[0];
        if (firstPage)
          return {
            pageParams: oldData.pageParams,
            pages: [
              {
                messages: [data, ...firstPage.messages],
                nextCursor: firstPage.nextCursor,
              },
            ],
          };
      });
    });

    return () => {
      socket.off("new-message");
    };
  }, [socket]);

  return (
    <div className={cn(className)}>
      {/* Header inbox */}
      <HeaderInbox
        data={conversation}
        className={
          "sticky flex items-center flex-row justify-between px-6 py-[18px] bg-muted"
        }
      />
      {/* List of messages */}
      <ScrollArea className="max-h-full px-6 pt-7 pb-1 grow">
        <div ref={ref} />
        {isFetchingNextPage && (
          <LoaderCircle className="mx-auto size-5 animate-spin" />
        )}
        {status === "pending" && (
          <div className="space-y-2 max-w-full">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex items-center space-x-4 w-full",
                  idx % 1 === 0 && "justify-end"
                )}
              >
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 max-w-[500px]">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}
        {status === "success" && !messages.length && !hasNextPage && (
          <span className="text-center text-destructive">
            Không có thông báo nào.
          </span>
        )}
        {status === "error" && (
          <div className="size-full flex flex-col items-center justify-center space-y-5 opacity-50">
            <TriangleAlert className="size-20" />
            <span className="font-semibold">Lỗi</span>
          </div>
        )}
        <ListOfMessages data={messages} />
      </ScrollArea>
      {/* Input for new message */}
      <InputForNewChat
        data={conversation}
        className={"sticky bottom-0 bg-muted px-6 py-5"}
      />
    </div>
  );
};

export default MessageInbox;

const HeaderInbox = ({ className, data }) => {
  const { currentData } = useCurrentStore();
  const { isInfoOpen, setIsInfoOpen, setConversation, conversation } =
    useConversationStore();
  const [isShowVideoRoom, setIsShowVideoRoom] = useState(false);
  const [isShowAudioRoom, setIsShowAudioRoom] = useState(false);
  const userConversation = data?.participants.find(
    (el) => el._id !== currentData._id
  );

  return (
    <div className={cn(className)}>
      {/* Video room */}
      <AudioVideoRoom
        open={isShowVideoRoom}
        onOpenChange={setIsShowVideoRoom}
        video
      />
      {/* Audio room */}
      <AudioVideoRoom
        open={isShowAudioRoom}
        onOpenChange={setIsShowAudioRoom}
      />
      <div className="flex items-center space-x-3">
        <div
          className="cursor-pointer opacity-50 hover:opacity-100 transition-all"
          onClick={() => setConversation(null)}
        >
          <ArrowLeft className="size-5" />
        </div>
        <UserAvatar
          avatarUrl={userConversation?.avatarUrl}
          displayName={userConversation?.displayName}
          className={"size-[50px] border border-primary"}
        />
        <div className="flex flex-col space-y-0.5 cursor-default">
          <span className="text-sm font-medium">
            {userConversation?.displayName}
          </span>
          <small
            className={cn(
              "font-medium",
              userConversation?.status === "Offline"
                ? "opacity-50"
                : "text-green-600"
            )}
          >
            {userConversation.status === "Online"
              ? "Đang hoạt động"
              : userConversation.status_expiry_time
              ? formatRelativeDate(userConversation.status_expiry_time)
              : "Offline"}
          </small>
        </div>
      </div>
      <div className="flex items-center space-x-3 h-full">
        <TooltipIcon
          content={"Gọi thoại"}
          onClick={() => setIsShowAudioRoom(true)}
        >
          <Phone className="size-5" />
        </TooltipIcon>
        <TooltipIcon
          content={"Gọi video"}
          onClick={() => setIsShowVideoRoom(true)}
        >
          <Video className="size-5" />
        </TooltipIcon>
        <Divider
          className={
            "h-full w-fit border-primary opacity-40 hidden xl:block lg:block"
          }
        />
        <TooltipIcon
          content={"Thông tin người dùng"}
          onClick={() => setIsInfoOpen(isInfoOpen)}
          className="hidden xl:block lg:block"
        >
          <Info className="size-5" />
        </TooltipIcon>
      </div>
    </div>
  );
};

const TooltipIcon = ({ children, content, onClick, className }) => {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild className={className}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onClick && onClick()}
            className="opacity-50 hover:opacity-100 transition-all"
          >
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="end">
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const ListOfMessages = ({ data }) => {
  const { currentData } = useCurrentStore();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
  }, []);

  return data?.map((chat, idx) => {
    const renderMessage = () => {
      switch (chat.type) {
        case "Doc":
          return (
            <DocumentMessage
              author={chat.senderId}
              incoming={currentData._id === chat.senderId._id}
              timestamp={chat.createdAt}
              read_receipt={chat.read}
              document={chat.document}
              className={"max-h-full space-y-3 flex space-x-2"}
            />
          );
        case "Audio":
          return (
            <VoiceMessage
              author={chat.senderId}
              incoming={currentData._id === chat.senderId._id}
              timestamp={chat.createdAt}
              read_receipt={chat.read}
              audio={chat.audio}
              className={"max-h-full space-y-3 flex space-x-2"}
            />
          );
        case "Media":
          return (
            <MediaMessage
              author={chat.senderId}
              incoming={currentData._id === chat.senderId._id}
              timestamp={chat.createdAt}
              read_receipt={chat.read}
              medias={chat.medias}
              className={"max-h-full space-y-3 flex space-x-2"}
            />
          );
        case "Giphy":
          return (
            <GiphyMessage
              author={chat.senderId}
              incoming={currentData._id === chat.senderId._id}
              timestamp={chat.createdAt}
              read_receipt={chat.read}
              giphyUrl={chat.giphyUrl}
              className={"max-h-full space-y-3 flex space-x-2"}
            />
          );
        default:
          return (
            <TextMessage
              author={chat.senderId}
              content={chat.content}
              incoming={currentData._id === chat.senderId._id}
              timestamp={chat.createdAt}
              read_receipt={chat.read}
              className={"max-h-full space-y-3 flex space-x-2"}
            />
          );
      }
    };
    return (
      <div key={chat._id}>
        {renderMessage()}
        <div ref={scrollRef} />
      </div>
    );
  });
};

const InputForNewChat = ({ className, data }) => {
  const [input, setInput] = useState("");
  const [isGifOpen, setIsGifOpen] = useState(false);
  const [isShowVoidRecorder, setIsShowVoidRecorder] = useState(false);
  const { currentData } = useCurrentStore();

  const userConversation = data?.participants.find(
    (el) => el._id !== currentData._id
  );
  const mutation = useSendMessageMutation();

  const addEmoji = (e) => {
    const emoji = e.native;
    setInput(emoji ? input + emoji : input);
  };

  const handleSumbit = (e) => {
    e.preventDefault();
    const paylodad = {
      content: input,
      recipientId: userConversation._id,
    };
    mutation.mutate(paylodad, { onSuccess: () => setInput("") });
  };

  return (
    <div className={cn(className)}>
      {/* VoidRecorder */}
      <VoidRecorder
        open={isShowVoidRecorder}
        onOpenChange={setIsShowVoidRecorder}
        recipientId={userConversation._id}
      />
      <form
        onSubmit={handleSumbit}
        className="flex items-center justify-between space-x-3"
      >
        <div className="relative w-full">
          <Input
            placeholder={"Nhập tin nhắn..."}
            value={input}
            className="h-[52px] w-full rounded-md bg-card pr-10"
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setIsGifOpen(false)}
          />
          <div className="absolute right-1 top-1/2 -translate-y-1/2 items-center justify-end">
            {!input.trim() && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  className="opacity-50 hover:opacity-100 transition-all"
                  onClick={() => setIsShowVoidRecorder(true)}
                >
                  <Mic className="size-5" />
                </Button>
                <DropdownFile recipientId={userConversation._id} />
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  className="opacity-50 hover:opacity-100 transition-all"
                  onClick={() => setIsGifOpen(!isGifOpen)}
                >
                  <GifIcon size={24} />
                </Button>
              </>
            )}
            <EmojiButton addEmoji={addEmoji} />
          </div>
        </div>
        <LoadingButton
          variant="outline"
          className="border-card h-[52px]"
          loading={mutation.isPending}
          disabled={mutation.isPending || !input.trim()}
          type="submit"
        >
          <SendHorizontal className="size-5 -rotate-45" />
        </LoadingButton>
      </form>
      {isGifOpen && (
        <Giphy className={"w-full mt-3"} recipientId={userConversation._id} />
      )}
    </div>
  );
};

const EmojiButton = ({ addEmoji }) => {
  const { theme } = useTheme();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="opacity-50 hover:opacity-100 transition-all"
        >
          <Smile className="size-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0">
        <Picker
          data={data}
          icons={"solid"}
          theme={theme}
          onEmojiSelect={addEmoji}
        />
      </PopoverContent>
    </Popover>
  );
};

const GifIcon = ({ size = 20 }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 8h-2a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2v-4h-1" />
      <path d="M12 8v8" />
      <path d="M16 12h3" />
      <path d="M20 8h-4v8" />
    </svg>
  );
};

const DropdownFile = ({ recipientId }) => {
  const [isShowMediaPicker, setIsShowMediaPicker] = useState(false);
  const [isShowDocumentPicker, setIsShowDocumentPicker] = useState(false);

  return (
    <>
      {/* MediaPicker */}
      <MediaPicker
        open={isShowMediaPicker}
        onOpenChange={setIsShowMediaPicker}
        recipientId={recipientId}
      />
      {/* DocumentPicker */}
      <DocumentPicker
        open={isShowDocumentPicker}
        onOpenChange={setIsShowDocumentPicker}
        recipientId={recipientId}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-50 hover:opacity-100 transition-all"
          >
            <Link2 className="size-5 -rotate-45" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="flex flex-row space-x-2 items-center cursor-pointer"
            onClick={() => setIsShowMediaPicker(true)}
          >
            <Image className="size-5" />
            <span>Ảnh & video</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex flex-row space-x-2 items-center cursor-pointer"
            onClick={() => setIsShowDocumentPicker(true)}
          >
            <File className="size-5" />
            <span>Tập tin & tài liệu</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
