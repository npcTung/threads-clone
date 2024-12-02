import { cn } from "@/lib/utils";
import React, { useState, Fragment } from "react";
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
  MediaPicker,
  MsgSeparator,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollArea,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TypingIndicator,
  UserAvatar,
  useTheme,
  VoidRecorder,
} from "..";
import useCurrentStore from "@/zustand/useCurrentStore";
import icons from "@/lib/icons";
import { faker } from "@faker-js/faker";
import { Chat_History } from "@/data";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import useAppStore from "@/zustand/useAppStore";
import {
  DocumentMessage,
  MediaMessage,
  TextMessage,
  VoiceMessage,
} from "../messages";

const { Phone, Video, Info, SendHorizontal, Link2, Smile, Mic, Image, File } =
  icons;

const MessageInbox = ({ className }) => {
  return (
    <div className={cn(className)}>
      {/* Header inbox */}
      <HeaderInbox
        className={
          "sticky flex items-center flex-row justify-between px-6 py-[18px] bg-muted"
        }
      />
      {/* List of messages */}
      <ScrollArea className="max-h-full px-6 pt-7 pb-1 grow">
        <ListOfMessages />
      </ScrollArea>
      {/* Input for new message */}
      <InputForNewChat className={"sticky bottom-0 bg-muted px-6 py-5"} />
    </div>
  );
};

export default MessageInbox;

const listIconButton = [
  {
    id: 1,
    icon: <Phone className="size-5" />,
    tooltipContent: "Gọi thoại",
  },
  {
    id: 2,
    icon: <Video className="size-5" />,
    tooltipContent: "Gọi video",
  },
  {
    id: 3,
    icon: <Info className="size-5" />,
    tooltipContent: "Thông tin người dùng",
  },
];

const HeaderInbox = ({ className }) => {
  const { currentData } = useCurrentStore();
  const { isInfoOpen, setIsInfoOpen } = useAppStore();
  const [isShowVideoRoom, setIsShowVideoRoom] = useState(false);
  const [isShowAudioRoom, setIsShowAudioRoom] = useState(false);

  const handlePhoneVideoInfo = (value) => {
    switch (value) {
      case 1:
        setIsShowAudioRoom(true);
        break;
      case 2:
        setIsShowVideoRoom(true);
        break;
      case 3:
        setIsInfoOpen(isInfoOpen);
        break;

      default:
        break;
    }
  };

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
        <UserAvatar
          avatarUrl={currentData.avatarUrl}
          displayName={currentData.displayName}
          isOnline
          className={"size-[50px]"}
        />
        <div className="flex flex-col space-y-0.5 cursor-default">
          <span className="text-sm font-medium">{currentData.displayName}</span>
          <small className={cn("text-green-600 font-medium")}>Online</small>
        </div>
      </div>
      <div className="flex items-center space-x-3 h-full">
        {listIconButton.map((iconButton) => (
          <Fragment key={iconButton.id}>
            <TooltipIcon
              content={iconButton.tooltipContent}
              onClick={() => handlePhoneVideoInfo(iconButton.id)}
            >
              {iconButton.icon}
            </TooltipIcon>
            {iconButton.id === 2 && (
              <Divider className={"h-full w-fit border-primary opacity-40"} />
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

const TooltipIcon = ({ children, content, onClick }) => {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
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

const ListOfMessages = () => {
  return Chat_History.map((chat, idx) => {
    if (idx === Chat_History.length - 1) return <TypingIndicator key={idx} />;
    switch (chat.type) {
      case "separator":
        return <MsgSeparator date={chat.time} key={idx} />;
      default:
        switch (chat.subType) {
          case "doc":
            return (
              <DocumentMessage
                key={idx}
                author={{
                  avatarUrl: faker.image.avatar(),
                  displayName: faker.internet.displayName(),
                }}
                content={chat.message}
                incoming={chat.incoming}
                timestamp={Date(faker.date.recent())}
                read_receipt={chat.read_receipt}
                className={"max-h-full space-y-3 flex space-x-2"}
              />
            );
          case "voice":
            return (
              <VoiceMessage
                key={idx}
                author={{
                  avatarUrl: faker.image.avatar(),
                  displayName: faker.internet.displayName(),
                }}
                content={chat.message}
                incoming={chat.incoming}
                timestamp={Date(faker.date.recent())}
                read_receipt={chat.read_receipt}
                className={"max-h-full space-y-3 flex space-x-2"}
              />
            );
          case "img":
            return (
              <MediaMessage
                key={idx}
                author={{
                  avatarUrl: faker.image.avatar(),
                  displayName: faker.internet.displayName(),
                }}
                content={chat.message}
                medias={chat.images}
                incoming={chat.incoming}
                timestamp={Date(faker.date.recent())}
                read_receipt={chat.read_receipt}
                className={"max-h-full space-y-3 flex space-x-2"}
              />
            );
          default:
            return (
              <TextMessage
                key={idx}
                author={{
                  avatarUrl: faker.image.avatar(),
                  displayName: faker.internet.displayName(),
                }}
                content={chat.message}
                incoming={chat.incoming}
                timestamp={Date(faker.date.recent())}
                read_receipt={chat.read_receipt}
                className={"max-h-full space-y-3 flex space-x-2"}
              />
            );
        }
    }
  });
};

const InputForNewChat = ({ className }) => {
  const [input, setInput] = useState("");
  const [isGifOpen, setIsGifOpen] = useState(false);
  const [isShowVoidRecorder, setIsShowVoidRecorder] = useState(false);

  const addEmoji = (e) => {
    const emoji = e.native;
    setInput(emoji ? input + emoji : input);
  };

  const handleSumbit = (e) => {
    e.preventDefault();
    console.log(input);
    setInput("");
  };

  return (
    <div className={cn(className)}>
      {/* VoidRecorder */}
      <VoidRecorder
        open={isShowVoidRecorder}
        onOpenChange={setIsShowVoidRecorder}
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
                <DropdownFile />
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
        <Button
          variant="outline"
          className="border-card h-[52px]"
          disabled={!input.trim()}
          type="submit"
        >
          <SendHorizontal className="size-5 -rotate-45" />
        </Button>
      </form>
      {isGifOpen && <Giphy className={"w-full mt-3"} />}
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

const DropdownFile = () => {
  const [isShowMediaPicker, setIsShowMediaPicker] = useState(false);
  const [isShowDocumentPicker, setIsShowDocumentPicker] = useState(false);

  return (
    <>
      {/* MediaPicker */}
      <MediaPicker
        open={isShowMediaPicker}
        onOpenChange={setIsShowMediaPicker}
      />
      {/* DocumentPicker */}
      <DocumentPicker
        open={isShowDocumentPicker}
        onOpenChange={setIsShowDocumentPicker}
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
