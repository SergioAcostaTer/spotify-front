import * as React from "react";
import { SearchedSong } from "./SongSearched";
import getLiked from "@/services/getLiked";

export interface ILibraryProps {}

export default function Library(props: ILibraryProps) {
  const [data, setData] = React.useState<any>([]);

  React.useEffect(() => {
    getLiked().then((data) => setData(data));
  }, [localStorage]);

  return (
    <>
      <div>
        <div className="flex flex-col w-full mt-10 bg-[#121212]">
          {data?.map((song: any) => (
            <SearchedSong {...song} />
          ))}
        </div>
      </div>
    </>
  );
}
