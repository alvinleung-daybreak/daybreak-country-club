import React, { useEffect, useState } from "react";
import { AudioController } from "../TennisGame/Game/AssetManager/AudioAsset";

type Props = {};

const MuteButton = (props: Props) => {
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (!isMuted) {
      AudioController.unmute();
      return;
    }
    AudioController.mute();
  }, [isMuted]);

  return (
    <button onClick={() => setIsMuted(!isMuted)}>
      {isMuted && <MutedIcon />}
      {!isMuted && <UnmutedIcon />}
    </button>
  );
};

const UnmutedIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16.125 9.375C16.125 9.375 17.625 10.125 17.625 12C17.625 13.875 16.125 14.625 16.125 14.625M2.625 8.625V15.375H6.375L12.375 19.875V4.125L6.375 8.625H2.625Z"
      stroke="#FFFCF2"
      style={{
        stroke: "#FFFCF2",
        strokeOpacity: 1,
      }}
      // style="stroke:#FFFCF2;stroke:color(display-p3 1.0000 0.9882 0.9490);stroke-opacity:1;"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const MutedIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M21.375 8.625L16.125 15.375M16.125 8.625L21.375 15.375M2.625 8.625V15.375H6.375L12.375 19.875V4.125L6.375 8.625H2.625Z"
      stroke="#FFFCF2"
      style={{
        stroke: "#FFFCF2",
        strokeOpacity: 1,
      }}
      // style="stroke:#FFFCF2;stroke:color(display-p3 1.0000 0.9882 0.9490);stroke-opacity:1;"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export default MuteButton;
