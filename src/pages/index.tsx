import Image from "next/image";
import { Inter } from "next/font/google";
import { Search } from "@/components/Search";
import { useEffect, useRef, useState } from "react";
import Home from "@/components/Home";
import { setGlobalState, useGlobalState } from "@/context/globalState";
import { Controls } from "@/components/Controls";
import { ControlPC } from "@/components/ControlPC";
import useWindowSize from "@/hooks/useWidth";
import downloadSong from "@/services/singleSongDownload";
import Library from "@/components/Library";

const inter = Inter({ subsets: ["latin"] });

export default function Base() {
  const [mode, setMode] = useState(0);
  const [search, setSearch] = useState(false);
  const MusicPlayer = useRef(null);
  const MusicLabel = useRef(null);
  // const [width, setWidth] = useState(0);

  const song = useGlobalState("song")[0];
  const repeat = useGlobalState("repeat")[0];
  const playing = useGlobalState("playing")[0];
  const controls = useGlobalState("controls")[0];
  const queue = useGlobalState("queue")[0];
  const playlistIndex = useGlobalState("playlistIndex")[0];
  const songTime = useGlobalState("songTime")[0];
  const [actualTime, setActualTime] = useState(0);

  useEffect(() => {
    if (MusicLabel.current) {
      //make darker song.color
      // const color = (song?.color & 0xfefefe) >> 1;
      MusicLabel.current.style.backgroundColor = `${song?.color}`;
    }

    // MusicLabel.current.style.backgroundImage = "pink";
    // console.log(song?.color);
  }, [song]);

  // save queue AND song to localstorage

  // useEffect(() => {
  //   localStorage.setItem("song", JSON.stringify(song));
  //   localStorage.setItem("queue", JSON.stringify(queue));
  // }, [song, queue]);

  // load queue AND song from localstorage if exists

  // useEffect(() => {
  //   // when user touch the screen
  //   if (localStorage.getItem("song")) {
  //     setGlobalState("song", JSON.parse(localStorage.getItem("song")));
  //   }
  //   if (localStorage.getItem("queue")) {
  //     setGlobalState("queue", JSON.parse(localStorage.getItem("queue")));
  //   }
  // }, []);

  function newSong() {
    if (song) {
      MusicPlayer.current.pause();
      MusicPlayer.current.load();

      MusicPlayer.current.play();
    }
  }

  function managePlayAndPause() {
    if (playing) {
      MusicPlayer.current.pause();
    } else {
      MusicPlayer.current.play();
    }
    console.log(MusicPlayer.current.currentTime, song?.duration);
  }

  function nextSong() {
    console.log(playlistIndex, queue);
    if (repeat) {
      MusicPlayer.current.currentTime = 0;
      MusicPlayer.current.play();
    } else {
      if (playlistIndex < queue.length - 1) {
        setGlobalState("song", queue[playlistIndex + 1]);
        setGlobalState("playlistIndex", playlistIndex + 1);
      } else if (playlistIndex + 1 == queue.length) {
        setGlobalState("song", queue[0]);
        setGlobalState("playlistIndex", 0);
      }
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

  function changeCurrentTime() {
    MusicPlayer.current.currentTime = songTime;
  }

  useEffect(() => {
    newSong();
  }, [song]);

  useEffect(() => {
    managePlayAndPause();

    // if (playing) {
    //   setGlobalState("songTime", MusicPlayer.current.currentTime);
    // }
  }, [playing]);

  useEffect(() => {
    changeCurrentTime();
  }, [songTime]);

  //on audio ended

  // useEffect(() => {
  //   const width = window?.innerWidth;
  //   setWidth(width);
  // }, [window?.innerWidth]);

  const { width } = useWindowSize();

  return (
    <>
      <audio
        src={song?.audioBlob}
        ref={MusicPlayer}
        onEnded={nextSong}
        // onError={() => {
        //   downloadSong(
        //     song?.youtubeId,
        //     `${song?.title} - ${song?.artist}`
        //   ).then((res) => {
        //     console.log(res);

        //     setGlobalState("song", {
        //       ...song,
        //       audio: {
        //         url: res,
        //       },
        //     });
        //   });
        // }}
        onTimeUpdate={(e) => {
          setActualTime(e.target.currentTime);
        }}
        onLoad={managePlayAndPause}
        // onPause={() => setGlobalState("playing", false)}
        // onPlay={() => setGlobalState("playing", true)}
      ></audio>

      {mode === 0 && width < 640 ? <Home /> : ""}
      {mode === 1 && width < 640 ? <Search search /> : ""}
      {mode === 2 && width < 640 ? <Library/> : ""}

      <Controls time={actualTime} />
      <ControlPC time={actualTime} />

      {song?.title ? (
        <div className="w-full fixed bottom-16 flex justify-center cursor-pointer mb-1 z-30  sm:hidden">
          <div
            className="flex flex-row w-11/12 items-center justify-between  rounded-md h-14"
            ref={MusicLabel}
          >
            <div
              className="flex items-center w-full noselect"
              onClick={() => setGlobalState("controls", !controls)}
            >
              <img
                src={song?.thumbnail}
                alt={song?.title}
                className="h-10 m-0 ml-2"
              />
              <div className="pl-4 h-10">
                <p className="text-lg leading-6 select-none proxima">{song?.title}</p>
                <p className="text-sm leading-3 select-none proxima">{song?.artist}</p>
              </div>
            </div>

            <div
              className="right-0 h-full flex items-center"
              onClick={() => setGlobalState("playing", !playing)}
            >
              {playing ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-pause btn h-10 w-10 cursor-pointer mr-2 z-30"
                  viewBox="0 0 16 16"
                >
                  <path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-pause btn h-10 w-10 cursor-pointer mr-2 z-30"
                  viewBox="0 0 16 16"
                >
                  <path d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z" />
                </svg>
              )}
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      <div className="w-full h-24 bottom-0 fixed justify-around items-end grid grid-cols-3 z-20 pl-8 pr-8 bg-gradient-to-t from-black pb-2 sm:hidden">
        <div
          className="flex justify-center flex-col items-center"
          onClick={() => {
            setMode(0);
            setSearch(false);
          }}
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
          <p className="text-xs select-none">Home</p>
        </div>
        <div
          className="flex justify-center flex-col items-center"
          onClick={() => {
            setMode(1);
            setSearch(!search);
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
          <p className="text-xs select-none">Search</p>
        </div>
        <div
          className="flex justify-center flex-col items-center"
          onClick={() => {
            setMode(2);
            setSearch(false);
          }}
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
          <p className="text-xs select-none">Your library</p>
        </div>
      </div>
    </>
  );
}
