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
  }, [localStorage]);

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
            <h2 onClick={async () =>{
              addLiked(info)
              const res = await checkLike(info);
              setLiked(res);
            }} className="text-xl select-none">{liked ? "liked" : "not liked"}</h2>
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
