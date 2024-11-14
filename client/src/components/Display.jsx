import React from "react";
import { useState, useRef } from "react";


const Display = ({ contract, account }) => {
  "";
  const [data, setData] = useState();
  const addressRef = useRef(null);
  const getdata = async () => {
    let dataArray;
    const Otheraddress = addressRef.current.value // This will fetch the address of the other user jiski files view krni h.

    try {
      if (Otheraddress) {
        dataArray = await contract.display(Otheraddress); // This will give the data of the other user's files.
        console.log(dataArray);
      } else {
        dataArray = await contract.display(account); // This will show the data of the connected account.
      }
    } catch (e) {
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
            <a href={item} key={i} target="_blank" >
              <img
                key={i}
                src={`${item}`}
                alt="new"
                className="w-64 h-80 object-cover m-2"
              ></img>
            </a>
          );
        });
        setData(images);
      } else {
        alert("No image to display");
      }
    } catch (e) {
      alert("Kuch toh chuda tha!!", e);
    }
  };
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">{data}</div>
      <input
        type="text"
        placeholder="Enter Address"
        className="block mx-auto my-4 p-2 border rounded w-80"
        ref={addressRef}
      ></input>
      <button className="bg-blue-500 text-white p-2 rounded mx-auto block" onClick={getdata}>
        Get Data
      </button>
    </>
  );
};

export default Display;
