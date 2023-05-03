import { setGlobalState, useGlobalState } from "@/context/globalState";
import getSongAsBlobAndDownload from "@/services/singleSongDownload";
import * as React from "react";

export interface IControlsProps {
  time: number;
}

export function Controls({ time }: IControlsProps) {
  const song = useGlobalState("song")[0];
  const controls = useGlobalState("controls")[0];
  const playing = useGlobalState("playing")[0];
  const repeat = useGlobalState("repeat")[0];
  const queue = useGlobalState("queue")[0];
  const playlistIndex = useGlobalState("playlistIndex")[0];
  const [isDownloaded, setIsDownloaded] = React.useState(false);
  const songTime = useGlobalState("songTime")[0];
  const Controls = React.useRef() as React.MutableRefObject<HTMLDivElement>;
  const slider = React.useRef() as React.MutableRefObject<HTMLInputElement>;
  const image = React.useRef();
  const download = React.useRef() as React.MutableRefObject<HTMLButtonElement>;

  const secondsToMinutes = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedSeconds = remainingSeconds.toString().padStart(2, "0");
    return `${minutes}:${formattedSeconds}`;
  };

  React.useEffect(() => {
    Controls.current.style.backgroundImage = `linear-gradient(0, black 0%, ${song?.color} 100%)`;
    download.current.classList.remove("downloaded");
    setIsDownloaded(false);
  }, [song]);

  React.useEffect(() => {
    if (controls) {
      Controls.current.classList.remove("bottom-[-100vh]");
      Controls.current.classList.add("bottom-0");
    } else {
      Controls.current.classList.remove("bottom-0");
      Controls.current.classList.add("bottom-[-100vh]");
    }
  }, [controls]);

  function nextSong() {
    console.log(playlistIndex, queue);

    if (playlistIndex < queue.length - 1) {
      setGlobalState("song", queue[playlistIndex + 1]);
      setGlobalState("playlistIndex", playlistIndex + 1);
    } else if (playlistIndex + 1 == queue.length) {
      setGlobalState("song", queue[0]);
      setGlobalState("playlistIndex", 0);
    }
  }

  function previousSong() {
    console.log(playlistIndex, queue);
    if (playlistIndex > 0) {
      setGlobalState("song", queue[playlistIndex - 1]);
      setGlobalState("playlistIndex", playlistIndex - 1);
    } else if (playlistIndex == 0) {
      setGlobalState("song", queue[queue.length - 1]);
      setGlobalState("playlistIndex", queue.length - 1);
    }
  }

  return (
    <div
      ref={Controls}
      className=" w-full h-full fixed z-50 bottom-[-100vh] transition-all duration-300 items-center flex flex-col space-between bg-slate-600 sm:hidden"
    >
      <div className="relative">
        <button
          className="text-white w-10 h-10 rounded-full mt-4 mb-4 fixed left-8 mr-4"
          onClick={() => setGlobalState("controls", !controls)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-chevron-compact-down h-full w-full cursor-pointer "
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M1.553 6.776a.5.5 0 0 1 .67-.223L8 9.44l5.776-2.888a.5.5 0 1 1 .448.894l-6 3a.5.5 0 0 1-.448 0l-6-3a.5.5 0 0 1-.223-.67z"
            />
          </svg>
        </button>

        <div
          className="right-0 fixed mt-12 mr-8 bg-slate-50 rounded-full w-12 h-12 flex items-center justify-center cursor-pointer"
          onClick={async () => {
            download.current.classList.add("downloaded");

            if (isDownloaded) {
              return;
            }

            const blob = await getSongAsBlobAndDownload(
              song?.youtubeId,
              `${song?.title} - ${song?.artist}`
            );

            setIsDownloaded(true);
          }}
        >
          <div id="btn-download" ref={download}>
            <svg width="22px" height="16px" viewBox="0 0 22 16">
              <path
                d="M2,10 L6,13 L12.8760559,4.5959317 C14.1180021,3.0779974 16.2457925,2.62289624 18,3.5 L18,3.5 C19.8385982,4.4192991 21,6.29848669 21,8.35410197 L21,10 C21,12.7614237 18.7614237,15 16,15 L1,15"
                id="check"
              ></path>
              <polyline
                points="4.5 8.5 8 11 11.5 8.5"
                className="svg-out"
              ></polyline>
              <path d="M8,1 L8,11" className="svg-out"></path>
            </svg>
          </div>

          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="#000000"
            className=""
            viewBox="0 0 16 16"
          >
            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
          </svg> */}
        </div>
      </div>

      <img
        src={song?.thumbnail}
        alt={song?.title}
        ref={image}
        onContextMenu={(e) => e.preventDefault()}
        className=" m-0 w-[75%] object-cover mt-32 mb-16"
      />

      <div className="flex pl-8 pr-8 w-full flex-col">
        <div className="flex w-full justify-between ">
          <div className="flex flex-col">
            <p className="text-2xl">{song?.title}</p>
            <p>{song?.artist}</p>
          </div>
          <p>Like</p>
        </div>
        <div className="mt-5">
          <input
            type="range"
            min="0"
            value={time}
            max={song?.duration?.youtube / 1000}
            ref={slider}
            className="w-full cursor-pointer mb-0"
            onChange={(e: React.MutableRefObject<HTMLInputElement>) => {
              setGlobalState("songTime", e?.target?.value);
            }}
          />
          <div className="flex justify-between mt-[-12px]">
            <p className="noselect select-none">{secondsToMinutes(time)}</p>
            <p className="noselect select-none">
              {secondsToMinutes(song?.duration?.youtube / 1000)}
            </p>
          </div>
        </div>
        <div className="flex justify-around w-full items-center mt-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-repeat-1 h-6 w-6 cursor-pointer noselect"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M0 3.5A.5.5 0 0 1 .5 3H1c2.202 0 3.827 1.24 4.874 2.418.49.552.865 1.102 1.126 1.532.26-.43.636-.98 1.126-1.532C9.173 4.24 10.798 3 13 3v1c-1.798 0-3.173 1.01-4.126 2.082A9.624 9.624 0 0 0 7.556 8a9.624 9.624 0 0 0 1.317 1.918C9.828 10.99 11.204 12 13 12v1c-2.202 0-3.827-1.24-4.874-2.418A10.595 10.595 0 0 1 7 9.05c-.26.43-.636.98-1.126 1.532C4.827 11.76 3.202 13 1 13H.5a.5.5 0 0 1 0-1H1c1.798 0 3.173-1.01 4.126-2.082A9.624 9.624 0 0 0 6.444 8a9.624 9.624 0 0 0-1.317-1.918C4.172 5.01 2.796 4 1 4H.5a.5.5 0 0 1-.5-.5z"
            />
            <path d="M13 5.466V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192zm0 9v-3.932a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192z" />
          </svg>

          <svg
            className="bi bi-pause-circle-fill h-10 w-10 cursor-pointer noselect rotate-180 flex justify-center items-center fill-current text-slate-0"
            version="1.1"
            viewBox="0 0 700 580"
            xmlns="http://www.w3.org/2000/svg"
            onClick={() => {
              if (queue.length > 0) {
                previousSong();
              }
            }}
          >
            <path d="m450.53 263.68-308.82-183.04c-6.3711-3.7695-14.223-3.7695-20.59 0-6.3711 3.7812-10.293 10.758-10.293 18.305v366.07c0 7.5352 3.9219 14.523 10.289 18.293 3.1836 1.8906 6.7305 2.8359 10.289 2.8359s7.1055-0.94531 10.289-2.8359l308.82-183.03c6.3828-3.7812 10.301-10.758 10.301-18.305 0.003906-7.5508-3.9023-14.516-10.285-18.293z" />
            <path d="m542.5 482.18c-25.773 0-46.668-20.895-46.668-46.668v-315c0-25.773 20.895-46.668 46.668-46.668s46.668 20.895 46.668 46.668v315c0 25.773-20.895 46.668-46.668 46.668z" />
          </svg>

          {playing ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
              onClick={() => setGlobalState("playing", !playing)}
              className="bi bi-pause-circle-fill h-14 w-14 cursor-pointer noselect"
            >
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-pause-circle-fill h-14 w-14 cursor-pointer noselect"
              viewBox="0 0 16 16"
              onClick={() => setGlobalState("playing", !playing)}
            >
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.25 5C5.56 5 5 5.56 5 6.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C7.5 5.56 6.94 5 6.25 5zm3.5 0c-.69 0-1.25.56-1.25 1.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C11 5.56 10.44 5 9.75 5z" />
            </svg>
          )}

          <svg
            className="bi bi-pause-circle-fill h-10 w-10 cursor-pointer noselect fill-current text-slate-0"
            version="1.1"
            viewBox="0 0 700 550"
            xmlns="http://www.w3.org/2000/svg"
            onClick={() => {
              if (queue.length > 0) {
                nextSong();
                // setGlobalState("playing", true);
                // console.log(playing);
              }
            }}
          >
            <path d="m450.53 263.68-308.82-183.04c-6.3711-3.7695-14.223-3.7695-20.59 0-6.3711 3.7812-10.293 10.758-10.293 18.305v366.07c0 7.5352 3.9219 14.523 10.289 18.293 3.1836 1.8906 6.7305 2.8359 10.289 2.8359s7.1055-0.94531 10.289-2.8359l308.82-183.03c6.3828-3.7812 10.301-10.758 10.301-18.305 0.003906-7.5508-3.9023-14.516-10.285-18.293z" />
            <path d="m542.5 482.18c-25.773 0-46.668-20.895-46.668-46.668v-315c0-25.773 20.895-46.668 46.668-46.668s46.668 20.895 46.668 46.668v315c0 25.773-20.895 46.668-46.668 46.668z" />
          </svg>

          {!repeat ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-repeat-1 h-7 w-7 cursor-pointer noselect"
              viewBox="0 0 16 16"
              onClick={() => setGlobalState("repeat", !repeat)}
            >
              <path d="M11 5.466V4H5a4 4 0 0 0-3.584 5.777.5.5 0 1 1-.896.446A5 5 0 0 1 5 3h6V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192Zm3.81.086a.5.5 0 0 1 .67.225A5 5 0 0 1 11 13H5v1.466a.25.25 0 0 1-.41.192l-2.36-1.966a.25.25 0 0 1 0-.384l2.36-1.966a.25.25 0 0 1 .41.192V12h6a4 4 0 0 0 3.585-5.777.5.5 0 0 1 .225-.67Z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="#1ED760"
              className="bi bi-repeat-1 h-7 w-7 cursor-pointer noselect"
              viewBox="0 0 16 16"
              onClick={() => setGlobalState("repeat", !repeat)}
            >
              <path d="M11 4v1.466a.25.25 0 0 0 .41.192l2.36-1.966a.25.25 0 0 0 0-.384l-2.36-1.966a.25.25 0 0 0-.41.192V3H5a5 5 0 0 0-4.48 7.223.5.5 0 0 0 .896-.446A4 4 0 0 1 5 4h6Zm4.48 1.777a.5.5 0 0 0-.896.446A4 4 0 0 1 11 12H5.001v-1.466a.25.25 0 0 0-.41-.192l-2.36 1.966a.25.25 0 0 0 0 .384l2.36 1.966a.25.25 0 0 0 .41-.192V13h6a5 5 0 0 0 4.48-7.223Z" />
              <path d="M9 5.5a.5.5 0 0 0-.854-.354l-1.75 1.75a.5.5 0 1 0 .708.708L8 6.707V10.5a.5.5 0 0 0 1 0v-5Z" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
