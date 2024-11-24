import React from "react";

const ImageViewer = ({ url }) => {
  return <img src={url} alt="Preview" className="w-full h-auto" />;
};

export default ImageViewer;
