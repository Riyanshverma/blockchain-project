'use client'

import React, { useState } from "react"
import axios from "axios"

export default function FileUpload({ contract, account, provider }) {
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState("No File Selected")
  const [uploading, setUploading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (file) {
      try {
        setUploading(true)
        const formData = new FormData()
        formData.append("file", file)

        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: `59029e523dd9160000b1`,
            pinata_secret_api_key: `742255e1bdcc5c19a53e14caafb8a3f889ebccd789fde793c8958decd143b138`,
            "Content-Type": "multipart/form-data",
          },
        })

        const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`
        await contract.add(account, ImgHash)
        alert("Successfully Image Uploaded")
        setFileName("No image selected")
        setFile(null)
      } catch (e) {
        console.error(e)
        alert("Unable to upload image to Pinata")
      } finally {
        setUploading(false)
      }
    }
  }

  const retrieveFile = (e) => {
    try {
      const data = e.target.files?.[0]
      if (data) {
        const reader = new window.FileReader()
        reader.readAsArrayBuffer(data)
        reader.onloadend = () => {
          setFile(data)
        }
        setFileName(data.name)
      }
    } catch (error) {
      console.error(error)
      alert("Error in retrieving the file.")
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="file-upload"
            className="block w-full text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer transition duration-300 ease-in-out"
          >
            Choose File
          </label>
          <input
            disabled={!account || uploading}
            type="file"
            id="file-upload"
            name="data"
            onChange={retrieveFile}
            className="hidden"
          />
        </div>
        <input
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          className="block mx-auto my-4 p-2 border rounded w-80"
        />
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out ${(!file || uploading) && "opacity-50 cursor-not-allowed"
              }`}
            disabled={!file || uploading}
          >
            {uploading ? "Uploading..." : "Upload File"}
          </button>
        </div>
      </form>
    </div>
  )
}