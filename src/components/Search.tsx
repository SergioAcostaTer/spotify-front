import fetchSearch from "@/services/fetchSearch";
import * as React from "react";
import { SearchedSong } from "./SongSearched";
import { setGlobalState, useGlobalState } from "@/context/globalState";
import postSongSource from "@/services/postSongSource";
import getSongAsBlobAndDownload from "@/services/singleSongDownload";
import addLiked from "@/services/addLiked";

export interface ISearchProps {
  search: boolean;
}

export function Search({ search }: ISearchProps) {
  const [active, setActive] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [data, setData] = React.useState([]);
  const menu = React.useRef(null);
  const moreInfo = useGlobalState("moreInfo")[0];
  const info = useGlobalState("info")[0];
  const queue = useGlobalState("queue")[0];
  const input = React.useRef(null);

  React.useEffect(() => {
    if (moreInfo) {
      menu.current.classList.remove("bottom-[-100vh]");
      menu.current.classList.add("bottom-0");
    } else {
      menu.current.classList.remove("bottom-0");
      menu.current.classList.add("bottom-[-100vh]");
    }
  }, [moreInfo]);

  // React.useEffect(() => {
  //   if (search) {
  //     setActive(true);
  //   } else {
  //     setActive(false);
  //   }
  //   // setActive(!active);
  // }, [search]);

  const handleOnChange = (e: any) => {
    e.preventDefault();
    setQuery(e.target.value);
    if (query.length > 0) {
      fetchSearch(query).then((data) => setData(data));
    }
  };

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
            <h2 onClick={() =>{
              addLiked(info)
            }} className="text-xl select-none">Like</h2>
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
                const blob = await getSongAsBlobAndDownload(
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

      {active ? (
        <>
          <div>
            <form
              className="w-full outline-none relative flex items-center "
              onSubmit={(e) => {
                e.preventDefault();
                input.current.blur();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="absolute left-4 h-6 w-6 cursor-pointer"
                viewBox="0 0 16 16"
                onClick={() => {
                  input.current.blur();
                }}
              >
                <path
                  fill-rule="evenodd"
                  d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                />
              </svg>

              <input
                ref={input}
                autoFocus
                className="w-full h-12 outline-none text-xl px-4 bg-[#6b7280] pl-14"
                type="search"
                placeholder="What are you looking for?"
                onChange={handleOnChange}
              />

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="absolute right-4 h-8 w-8 cursor-pointer"
                onClick={() => {
                  input.current.value = "";
                  input.current.focus();
                }}
                viewBox="0 0 16 16"
              >
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
              </svg>
            </form>
          </div>

          <div className="flex flex-col w-full mt-10 bg-[#121212]">
            {data?.map((song: any) => (
              <SearchedSong {...song} />
            ))}
          </div>
        </>
      ) : (
        <div>
          <h1 className="mt-10 ml-6 text-3xl">Search</h1>

          <div className="flex w-full justify-center mt-10 ">
            <form className="w-11/12 outline-none">
              <input
                className="w-full h-12 outline-none text-xl rounded-md px-4"
                type="text"
                placeholder="What are you looking for?"
                onClick={() => {
                  window.innerWidth < 600 ? setActive(!active) : "";
                }}
              />
            </form>
          </div>
        </div>
      )}
    </>
  );
}
