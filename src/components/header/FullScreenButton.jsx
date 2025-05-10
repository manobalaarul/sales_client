import React, { useState } from "react";
import { FaExpand, FaCompress } from "react-icons/fa";

const FullScreenButton = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => setIsFullScreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullScreen(false));
    }
  };

  return (
    <button
      onClick={toggleFullScreen}
      className="bg-gray-300 px-2 py-2 rounded flex items-center gap-2"
    >
      {isFullScreen ? <FaCompress /> : <FaExpand />}
    </button>
  );
};

export default FullScreenButton;
