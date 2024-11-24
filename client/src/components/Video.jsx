import React from "react";
import ReactPlayer from "react-player";

const VideoViewer = ({ url }) => {
  return <ReactPlayer url={url} controls width="100%" className="bg-black" />;
};

export default VideoViewer;
