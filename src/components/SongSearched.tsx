import { setGlobalState, useGlobalState } from "@/context/globalState";
import postSongSource from "@/services/postSongSource";
import * as React from "react";

export interface ISearchedSongProps {
  title: string;
  artist: string;
  type: string;
  thumbnail: string;
  spotifyUrl: string;
}

export function SearchedSong({
  title,
  artist,
  type,
  thumbnail,
  spotifyUrl,
  ...props
}: ISearchedSongProps) {
  const queue = useGlobalState("queue")[0];
  const song = useGlobalState("song")[0];

  const [touchStart, setTouchStart] = React.useState(null);
  const [touchEnd, setTouchEnd] = React.useState(null);
  const [movedDiv, setMovedDiv] = React.useState(null);

  // the required distance between touchStart and touchEnd to be detected as a swipe
  const minSwipeDistance = 100;

  const onTouchStart = (e) => {
    setTouchEnd(null); // otherwise the swipe is fired even with usual touch events
    setTouchStart(e.targetTouches[0].clientX);
    //start when the swipe is only horizontal
  };

  const onTouchMove = (e) => {
    //avoid if swiping vertically

    setTouchEnd(e.targetTouches[0].clientX);
    //find parent dive
    while (
      e.target.className !=
      "flex pl-6 pr-6 mb-3 mt-3 cursor-pointer items-center"
    ) {
      e.target = e.target.parentElement;
    }
    if (
      e.targetTouches[0].clientX - touchStart < 150 &&
      e.targetTouches[0].clientX - touchStart > 20
    ) {
      e.target.style.transform = `translateX(${
        e.targetTouches[0].clientX - touchStart
      }px)`;

      //and also his previous brother
      e.target.previousSibling.style.transform = `translateX(${
        e.targetTouches[0].clientX - touchStart
      }px)`;
    }
    setMovedDiv([e.target, e.target.previousSibling]);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isRightSwipe) {
      movedDiv[0].style.transition = "transform 0.5s";
      movedDiv[1].style.transition = "transform 0.5s";
      movedDiv[0].style.transform = `translateX(0px)`;
      movedDiv[1].style.transform = `translateX(0px)`;
      setTimeout(() => {
        movedDiv[0].style.transition = "none";
        movedDiv[1].style.transition = "none";
      }, 500);

      const song = {
        title,
        artist,
        type,
        thumbnail,
        spotifyUrl,
        ...props,
      };

      postSongSource(song).then((data) => {
        //push in queue avoid iteration error

        queue.push(data);

        setGlobalState("queue", queue);
      });
    } else {
      movedDiv[0].style.transition = "transform 0.5s";
      movedDiv[1].style.transition = "transform 0.5s";
      movedDiv[0].style.transform = `translateX(0px)`;
      movedDiv[1].style.transform = `translateX(0px)`;
      setTimeout(() => {
        movedDiv[0].style.transition = "none";
        movedDiv[1].style.transition = "none";
      }, 500);
    }
  };

  return (
    <div className="relative">
      <div className="w-full h-full absolute bg-[#1DB954] left-[-100vw] flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="#fff"
          className="bi bi-cloud-plus absolute right-[40px] w-8 h-8"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M8 5.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8.5H6a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 .5-.5z"
          />
          <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z" />
        </svg>
      </div>
      <div
        key={spotifyUrl}
        className="flex pl-6 pr-6 mb-3 mt-3 cursor-pointer items-center"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex flex-row w-[100%] items-center"
          onClick={async () => {
            const song = {
              title,
              artist,
              type,
              thumbnail,
              spotifyUrl,
              ...props,
            };

            postSongSource(song).then((data) => {
              setGlobalState("song", data);

              if (song?.duration != 0 && queue.length == 0) {
                setGlobalState("queue", [data]);

                console.log("queue", queue);
              }
            });
          }}
        >
          <img
            src={thumbnail}
            alt={title}
            className="h-14 m-0 "
            onContextMenu={(e) => e.preventDefault()}
          />

          <div className="flex flex-row pl-6 flex-col">
            <p className="noselect select-none">{title}</p>
            <div className="flex flex-row noselect select-none">
              <p>
                {type.charAt(0).toUpperCase() + type.slice(1)} - {artist}
              </p>
            </div>
          </div>
        </div>

        <svg
          onClick={() => {
            const song = {
              title,
              artist,
              type,
              thumbnail,
              spotifyUrl,
              ...props,
            };

            setGlobalState("info", song);
            setGlobalState("moreInfo", true);

            // postSongSource(song).then((data) => {
            //   //push in queue avoid iteration error

            //   queue.push(data);
            //   localStorage.setItem("queue", JSON.stringify(queue));

            //   setGlobalState("queue", queue);
            // });
          }}
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-three-dots z-30 h-6 w-6 cursor-pointer mr-0 rotate-90"
          viewBox="0 0 16 16"
        >
          <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
        </svg>
      </div>
    </div>
  );
}
