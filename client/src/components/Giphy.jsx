import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  ScrollArea,
} from "./ui";
import { cn } from "@/lib/utils";
import icons from "@/lib/icons";
import _ from "lodash";
import { GiphyFetch } from "@giphy/js-fetch-api";
import { Grid } from "@giphy/react-components";
import { LoadingButton } from ".";
import { useSendMessageGiphyMutation } from "./chats/mutation";

const { AlertCircle, Search } = icons;

const gf = new GiphyFetch(import.meta.env.VITE_API_GIPHY);

const Giphy = ({ className, recipientId }) => {
  const gridRef = useRef(null);
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [gifs, setGifs] = useState([]);
  const [gifUrl, setGifUrl] = useState("");
  const [isShowSendGif, setIsShowSendGif] = useState(false);

  const fetchGifs = async (offset) => gf.search(value, { offset, limit: 10 });

  const fetchInitialGifs = async () => {
    setIsLoading(false);
    setError(null);

    try {
      const initialGifs = await fetchGifs(0);
      setGifs(initialGifs.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedfetchGifs = _.debounce(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const newGifs = await fetchGifs(0);
      setGifs(newGifs.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, 500);

  const handleGifClick = (gif, e) => {
    e.preventDefault();
    const gifUrl = gif.images.original.url;
    setGifUrl(gifUrl);
    setIsShowSendGif(true);
  };

  useEffect(() => {
    fetchInitialGifs();
  }, []);

  return (
    <div ref={gridRef} className={cn(className)}>
      <DialogSendGif
        open={isShowSendGif}
        onOpenChange={setIsShowSendGif}
        gifUrl={gifUrl}
        recipientId={recipientId}
      />
      <Input
        value={value}
        placeholder={"Tìm kiếm Gif..."}
        onChange={(e) => {
          setValue(e.target.value);
          debouncedfetchGifs();
        }}
        className="mb-2"
      />

      {isLoading && <span>Loading GIFs...</span>}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="size-5" />
          <AlertTitle>Lỗi:</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <ScrollArea className="h-48">
        <div className="size-full">
          {gifs.length > 0 ? (
            <Grid
              width={gridRef.current?.offsetWidth}
              columns={8}
              gutter={6}
              fetchGifs={fetchGifs}
              key={value}
              onGifClick={handleGifClick}
              data={gifs}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-muted-foreground size-full space-y-2 mt-10">
              <Search className="size-10" />
              <span className="text-xl font-semibold">
                Vui lòng tìm kiếm Gif
              </span>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Giphy;

const DialogSendGif = ({ open, onOpenChange, gifUrl, recipientId }) => {
  const mutation = useSendMessageGiphyMutation();

  const handleSumbit = () => {
    const payload = { giphyUrl: gifUrl, recipientId };
    mutation.mutate(payload, { onSuccess: () => onOpenChange(false) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gửi ảnh Gif</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <div className="size-full space-y-5">
          <div className="max-h-[400px] overflow-hidden rounded-md">
            <img src={gifUrl} alt={gifUrl} className="size-full object-cover" />
          </div>
          <div className="flex flex-row items-center justify-between space-x-2">
            <LoadingButton
              variant="outline"
              loading={mutation.isPending}
              disabled={mutation.isPending}
              className="bg-muted w-full"
              onClick={handleSumbit}
            >
              Gửi
            </LoadingButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
