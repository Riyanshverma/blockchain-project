import React, { useState, useRef } from "react";
import PdfViewer from "./PdfViewer";
import ImageViewer from "./ImageViewer";
import VideoViewer from "./Video";
import DisplayModal from "./DisplayModal";
import { pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const Display = ({ contract, account }) => {
  const [data, setData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const addressRef = useRef(null);

  const getdata = async () => {
    let dataArray;
    const Otheraddress = addressRef.current.value;

    try {
      if (Otheraddress) {
        dataArray = await contract.display(Otheraddress);
        console.log(dataArray);
      } else {
        dataArray = await contract.display(account);
      }
    } catch (e) {
      console.error("Error fetching data:", e);
      alert("You don't have access");
      return;
    }

    try {
      const isEmpty = dataArray.length === 0;
      if (!isEmpty) {
        const previews = dataArray.map((item, i) => (
          <div key={i} className="m-2">
            <p className="text-white">{item.name}</p>
            <button
              className="bg-blue-500 text-white p-2 rounded mt-2"
              onClick={() => {
                setSelectedFile(item);
                setIsModalOpen(true);
              }}
            >
              Show Data
            </button>
          </div>
        ));
        setData(previews);
      } else {
        alert("No files to display");
      }
    } catch (e) {
      console.error("Error processing data:", e);
      alert("Error processing data");
    }
  };

  const renderFilePreview = (file) => {
    if (!file) return null;
    const { name, url } = file;
    const fileType = name.split(".").pop();
    switch (fileType) {
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <ImageViewer url={url} />;
      case "mp4":
      case "webm":
      case "ogg":
        return <VideoViewer url={url} />;
      case "pdf":
        return <PdfViewer url={url} />;
      default:
        return (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full h-auto text-white"
          >
            {url}
          </a>
        );
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {data}
      </div>
      <input
        type="text"
        placeholder="Enter Address"
        className="block mx-auto my-4 p-2 border rounded w-80"
        ref={addressRef}
      ></input>
      <button
        className="bg-blue-500 text-white p-2 rounded mx-auto block"
        onClick={getdata}
      >
        Get Data
      </button>
      <DisplayModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedFile && (
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-gray-100 text-2xl font-semibold mb-4">
              {selectedFile.name}
            </h2>
            {renderFilePreview(selectedFile)}
          </div>
        )}
      </DisplayModal>
    </>
  );
};

export default Display;
