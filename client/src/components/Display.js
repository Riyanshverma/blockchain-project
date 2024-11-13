import React from 'react'
import { useState } from "react";
import "./Display.css";

const Display = ({ contract, account }) => {

  const [data, setData] = useState("");
  const getdata = async () => {
    let dataArray;
    const Otheraddress = document.querySelector(".address").value; // This will fetch the address of the other user jiski files view krni h.

    try {
      if (Otheraddress) {
        dataArray = await contract.display(Otheraddress); // This will give the data of the other user's files.
        console.log(dataArray);
      }
      else {
        dataArray = await contract.display(account); // This will show the data of the connected account.
      }
    }
    catch (e) {
      alert("You don't have access");
    }
    try {
      const isEmpty = Object.keys(dataArray).length === 0; // This will check if the user whose data we want to see, actually have any data or not.
      if (!isEmpty) {
        const str = dataArray.toString();
        const str_array = str.split(",");
        // console.log(str);
        // console.log(str_array);

        const images = str_array.map((item, i) => {
          return (
            <a href={item} key={i} target="_blank">
              <img key={i} src={`${item}`} alt="new" className="image-list"></img>
            </a>
          )
        })
        setData(images);
      }
      else {
        alert("No image to display");
      }
    }
    catch (e) {
      alert("Kuch toh chuda tha!!",e)
    }
  }
  return (
    <>
      <div className="image-list">{data}</div>
      <input
        type="text"
        placeholder="Enter Address"
        className="address"
      ></input>
      <button className="center button" onClick={getdata}>
        Get Data
      </button>
    </>
  )
}

export default Display
