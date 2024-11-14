import React from "react";
import { useState } from "react";
import axios from "axios"; /* Is used for interacting with pinata. */

const FileUpload = ({ contract, account, provider }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No image selected");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: `59029e523dd9160000b1`,
            pinata_secret_api_key: `742255e1bdcc5c19a53e14caafb8a3f889ebccd789fde793c8958decd143b138`,
            "Content-Type": "multipart/form-data",
          },
        });
        /* This resFile function will upload the file on IPFS through pinata. */

        const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`; /* This will generate a hash of the file after uploading. */
        contract.add(
          account,
          ImgHash
        ); /* This will add the image to blockchain. */
        alert("Successfully Image Uploaded");
        setFileName("No image selected");
        setFile(null);
      } catch (e) {
        alert(
          "Unable to upload image to Pinata"
        ); /* This error will occur while uploading any file on pinata. */
      }
    }
    alert("Successfully Image Uploaded");
    setFileName("No image selected");
    setFile(null);
  };

  const retrieveFile = async (e) => {
    /* This function takes the file from the user. Now the task is to get multiples fils uploaded. */
    try {
      const data = e.target.files[0]; // Selecting an image from array of files object.
      // console.log(data);
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(data);
      reader.onloadend = () => {
        setFile(e.target.files[0]);
      };
      setFileName(e.target.files[0].name);
      e.preventDefault();
    } catch {
      alert("Error in retireving the file.");
    }
  };

  return (
    <div>
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="file-upload" className="bg-green-500 text-white p-2 rounded cursor-pointer">
          Choose Image
        </label>
        <input
          disabled={!account}
          type="file"
          id="file-upload"
          name="data"
          onChange={retrieveFile}
          className="hidden"
        />
        <span className="text-white">Image: {fileName}</span>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded" disabled={!file}>
          Upload File
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
