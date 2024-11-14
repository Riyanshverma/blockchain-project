import React from 'react'
import { useEffect } from "react";

const Modal = ({ setModalOpen, contract }) => {

  const sharing = async () => {
    const address = document.querySelector(".address").value; // Fetching the value of address whom we want to share with.
    await contract.allow(address);
    setModalOpen(false);
    console.log("Shared")
  };

  useEffect(() => {
    const accessList = async () => {
      const addressList = await contract.shareAccess();
      let select = document.querySelector("#selectNumber");
      const options = addressList;

      for (let i = 0; i < options.length; i++) {
        let opt = options[i];
        let e1 = document.createElement("option");
        e1.textContent = opt;
        e1.value = opt;
        select.appendChild(e1);
      }
    }
    contract && accessList();
  }, [contract])
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded shadow-lg">
          <div className="text-center">
            <h2 className="text-xl font-bold">Share with</h2>
          </div>
          <div className="mt-4">
            <input type="text" className="border p-2 w-full" placeholder="Enter Address" />
          </div>
          <form id="myForm" className="mt-4">
            <select id="selectNumber" className="border p-2 w-full">
              <option>People With Access</option>
            </select>
          </form>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setModalOpen(false)}
              className="bg-red-500 text-white p-2 rounded mr-2"
            >
              Cancel
            </button>
            <button onClick={sharing} className="bg-blue-500 text-white p-2 rounded">
              Share
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Modal
