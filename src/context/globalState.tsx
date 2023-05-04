import { createGlobalState } from "react-hooks-global-state";

const { setGlobalState, useGlobalState } = createGlobalState({
  song: {
    title: "",
    artist: "",
    type: "",
    thumbnail: "",
    spotifyUrl: "",
    audio: { url: "" },
    id: "",
    duration: {
      spotify: 0,
      youtube: 0,
    },
    youtubeId: "",
    color: "",
  },
  playing: false,
  queue: [],
  playlistIndex: 0,
  volume: 0.5,
  repeat: false,
  shuffle: false,
  controls: false,
  songTime: 0,
  moreInfo: false,
  info: {},
});

export { setGlobalState, useGlobalState };
