import * as React from "react";
import { SearchedSong } from "./SongSearched";
import getLiked from "@/services/getLiked";
import { setGlobalState, useGlobalState } from "@/context/globalState";
import addLiked from "@/services/addLiked";
import postSongSource from "@/services/postSongSource";
import downloadSong from "@/services/singleSongDownload";
import checkLike from "@/services/checkLike";

export interface ILibraryProps {}

export default function Library(props: ILibraryProps) {
  const toggleLike = useGlobalState("toggleLike")[0];
  const [data, setData] = React.useState<any>([]);
  const menu = React.useRef(null);
  const moreInfo = useGlobalState("moreInfo")[0];
  const info = useGlobalState("info")[0];
  const queue = useGlobalState("queue")[0];
  const [liked, setLiked] = React.useState(false);

  React.useEffect(() => {
    if (moreInfo) {
      menu.current.classList.remove("bottom-[-100vh]");
      menu.current.classList.add("bottom-0");
    } else {
      menu.current.classList.remove("bottom-0");
      menu.current.classList.add("bottom-[-100vh]");
    }
    async function asyncCheckLike() {
      const res = await checkLike(info);
      setLiked(res);
    }
    asyncCheckLike();
  }, [moreInfo]);

  React.useEffect(() => {
    getLiked().then((data) => setData(data));
  }, [localStorage, toggleLike]);

  return (
    <>
      <div
        ref={menu}
        className="transition-all duration-100 fixed bottom-[-100vh] w-full h-full z-[50] bg-[linear-gradient(0,rgba(0,0,0,1)0%,rgba(0,0,0,1)83%,rgba(0,0,0,0.5635504201680672)96%,rgba(0,0,0,0)100%)]"
      >
        <div
          onClick={() => {
            setGlobalState("moreInfo", false);
          }}
          className="flex flex-col items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-x absolute right-10 top-10 w-10 h-10 cursor-pointer"
            viewBox="0 0 16 16"
          >
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
          </svg>

          <div className="flex flex-col items-center mt-36">
            <img
              src={info?.thumbnail}
              alt={info?.title}
              className="w-[150px] object-cover"
            />
            <div className="mt-2 flex flex-col justify-center items-center">
              <h1 className="text-base select-none">{info?.title}</h1>
              <h2 className="text-xs select-none">{info?.artist}</h2>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full items-center mt-14 gap-8">
          <div
            onClick={() => {
              setGlobalState("moreInfo", false);
            }}
          >
            <h2
              onClick={async () => {
                addLiked(info);
                getLiked().then((data) => setData(data));

                const res = await checkLike(info);
                setLiked(res);
              }}
              className="text-xl select-none"
            >
              {liked ? (
                <div className="flex items-center justify-center gap-2">
                  <h2>Added to likes</h2>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-heart-fill h-5 w-5"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
                    />
                  </svg>
                </div>
              ) : (
                <div>
                  <h2>Add to likes</h2>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-heart-fill h-5 w-5"
                    viewBox="0 0 16 16"
                  >
                    <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
                  </svg>
                </div>
              )}
            </h2>
          </div>
          <div
            onClick={() => {
              postSongSource(info).then((data) => {
                //push in queue avoid iteration error
                queue.push(data);
                localStorage.setItem("queue", JSON.stringify(queue));

                setGlobalState("queue", queue);
              });
              setGlobalState("moreInfo", false);
            }}
          >
            <h2 className="text-xl select-none">Add to queue</h2>
          </div>
          <div
            onClick={() => {
              setGlobalState("moreInfo", false);
            }}
          >
            <h2 className="text-xl select-none">Add to playlist</h2>
          </div>
          <div
            onClick={async () => {
              postSongSource(info).then(async (data) => {
                const blob = await downloadSong(
                  data?.youtubeId,
                  `${data?.title} - ${data?.artist}`
                );
              });

              setGlobalState("moreInfo", false);
            }}
          >
            <h2 className="text-xl select-none">Download</h2>
          </div>
        </div>
      </div>
      <div>
        <div className="flex flex-col w-full mt-10 bg-[#121212]">
          {data?.map((song: any) => (
            <SearchedSong {...song} key={song?.id} />
          ))}
        </div>
      </div>
    </>
  );
}
