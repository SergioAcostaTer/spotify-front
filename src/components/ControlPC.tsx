import { setGlobalState, useGlobalState } from "@/context/globalState";
import useWindowSize from "@/hooks/useWidth";
import * as React from "react";
import { SearchPC } from "./SearchPC";

export interface IControlPCProps {
  time: number;
}

export function ControlPC({ time }: IControlPCProps) {
  const song = useGlobalState("song")[0];
  const queue = useGlobalState("queue")[0];
  const playlistIndex = useGlobalState("playlistIndex")[0];
  const [playing, setPlaying] = useGlobalState("playing");
  const [repeat, setRepeat] = useGlobalState("repeat");
  const [mode, setMode] = React.useState(0);

  // const [widthh, setWidth] = React.useState(0);

  const slider = React.useRef(null);

  const secondsToMinutes = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedSeconds = remainingSeconds.toString().padStart(2, "0");
    return `${minutes}:${formattedSeconds}`;
  };

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

  const { width, height } = useWindowSize();

  return (
    <>
      <div className="flex flex-col h-full max-sm:hidden">
        <div className="relative flex flex-row h-[calc(100%-100px)]">
          <div className="w-[270px] bg-[#000] h-full">
            <div className="flex flex-col pt-10 pl-6 gap-5">
              <div
                className="flex justify-start flex-row items-center cursor-pointer"
                onClick={() => setMode(0)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-house h-6 w-6 cursor-pointer"
                  viewBox="0 0 16 16"
                >
                  <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z" />
                </svg>
                <p className="text-base select-none pl-4">Home</p>
              </div>
              <div
                className="flex justify-start flex-row items-center cursor-pointer"
                onClick={() => {
                  setMode(1);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-search h-6 w-6 cursor-pointer"
                  viewBox="0 0 16 16"
                >
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                </svg>
                <p className="text-base select-none pl-4">Search</p>
              </div>
              <div
                className="flex justify-start flex-row items-center cursor-pointer"
                onClick={() => setMode(2)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-collection h-6 w-6 cursor-pointer"
                  viewBox="0 0 16 16"
                >
                  <path d="M2.5 3.5a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-11zm2-2a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1h-7zM0 13a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 16 13V6a1.5 1.5 0 0 0-1.5-1.5h-13A1.5 1.5 0 0 0 0 6v7zm1.5.5A.5.5 0 0 1 1 13V6a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-13z" />
                </svg>
                <p className="text-base select-none pl-4">Your library</p>
              </div>
            </div>
          </div>

          <div className="w-[calc(100%-270px)] h-full">
            {mode === 0 && width > 640 ? <h1>as</h1> : ""}
            {mode === 1 && width > 640 ? <SearchPC /> : ""}
            {mode === 2 && width > 640 ? <h1>Library</h1> : ""}
          </div>
        </div>

        <div className="bg-[#181818] w-full h-[100px] absolute bottom-0 z-30 grid grid-cols-3  justify-between">
          <div className="flex flex-row items-center ml-4">
            <img
              src={song?.thumbnail}
              alt={song?.title}
              className="w-[60px] h-[60px]"
            />
            <div className="ml-2">
              <p>{song?.title}</p>
              <p>{song?.artist}</p>
            </div>
          </div>
          <div className="w-full flex flex-col items-center">
            <div>
              <div className="flex justify-around w-full items-center mt-4 gap-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-repeat-1 h-5 w-5 cursor-pointer noselect"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M0 3.5A.5.5 0 0 1 .5 3H1c2.202 0 3.827 1.24 4.874 2.418.49.552.865 1.102 1.126 1.532.26-.43.636-.98 1.126-1.532C9.173 4.24 10.798 3 13 3v1c-1.798 0-3.173 1.01-4.126 2.082A9.624 9.624 0 0 0 7.556 8a9.624 9.624 0 0 0 1.317 1.918C9.828 10.99 11.204 12 13 12v1c-2.202 0-3.827-1.24-4.874-2.418A10.595 10.595 0 0 1 7 9.05c-.26.43-.636.98-1.126 1.532C4.827 11.76 3.202 13 1 13H.5a.5.5 0 0 1 0-1H1c1.798 0 3.173-1.01 4.126-2.082A9.624 9.624 0 0 0 6.444 8a9.624 9.624 0 0 0-1.317-1.918C4.172 5.01 2.796 4 1 4H.5a.5.5 0 0 1-.5-.5z"
                  />
                  <path d="M13 5.466V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192zm0 9v-3.932a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192z" />
                </svg>

                <svg
                  className="bi bi-pause-circle-fill h-6 w-6 cursor-pointer noselect rotate-180 flex justify-center items-center fill-current text-slate-0"
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
                    className="bi bi-pause-circle-fill h-10 w-10 cursor-pointer noselect"
                  >
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-pause-circle-fill h-10 w-10 cursor-pointer noselect"
                    viewBox="0 0 16 16"
                    onClick={() => setGlobalState("playing", !playing)}
                  >
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.25 5C5.56 5 5 5.56 5 6.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C7.5 5.56 6.94 5 6.25 5zm3.5 0c-.69 0-1.25.56-1.25 1.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C11 5.56 10.44 5 9.75 5z" />
                  </svg>
                )}

                <svg
                  className="bi bi-pause-circle-fill h-6 w-6 cursor-pointer noselect fill-current text-slate-0"
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
                    className="bi bi-repeat-1 h-5 w-5 cursor-pointer noselect"
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
                    className="bi bi-repeat-1 h-5 w-5 cursor-pointer noselect"
                    viewBox="0 0 16 16"
                    onClick={() => setGlobalState("repeat", !repeat)}
                  >
                    <path d="M11 4v1.466a.25.25 0 0 0 .41.192l2.36-1.966a.25.25 0 0 0 0-.384l-2.36-1.966a.25.25 0 0 0-.41.192V3H5a5 5 0 0 0-4.48 7.223.5.5 0 0 0 .896-.446A4 4 0 0 1 5 4h6Zm4.48 1.777a.5.5 0 0 0-.896.446A4 4 0 0 1 11 12H5.001v-1.466a.25.25 0 0 0-.41-.192l-2.36 1.966a.25.25 0 0 0 0 .384l2.36 1.966a.25.25 0 0 0 .41-.192V13h6a5 5 0 0 0 4.48-7.223Z" />
                    <path d="M9 5.5a.5.5 0 0 0-.854-.354l-1.75 1.75a.5.5 0 1 0 .708.708L8 6.707V10.5a.5.5 0 0 0 1 0v-5Z" />
                  </svg>
                )}
              </div>
            </div>
            <div className="w-[85%] flex flex-row items-center">
              <p className="text-xs mr-[5px] mb-[-7px]">
                {secondsToMinutes(time)}
              </p>
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
              <p className="text-xs ml-[5px] mb-[-7px]">
                {secondsToMinutes(song?.duration?.youtube / 1000)}
              </p>
            </div>
          </div>
          <div></div>
        </div>
      </div>
    </>
  );
}
