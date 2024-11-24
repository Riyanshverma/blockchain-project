import React, { useEffect } from "react";

const Modal = ({ setModalOpen, contract }) => {
  const sharing = async () => {
    const addressInput = document.querySelector(".address");
    if (addressInput) {
      const address = addressInput.value; // Fetching the value of address whom we want to share with.
      try {
        await contract.allow(address);
        setModalOpen(false);
        console.log("Shared");
      } catch (error) {
        console.error("Error sharing access:", error);
      }
    } else {
      console.error("Address input element not found");
    }
  };

  const revoking = async () => {
    const addressInput = document.querySelector(".address");
    if (addressInput) {
      const address = addressInput.value; // Fetching the value of address whom we want to revoke access from.
      try {
        await contract.disallow(address);
        setModalOpen(false);
        console.log("Access Revoked");
      } catch (error) {
        console.error("Error revoking access:", error);
      }
    } else {
      console.error("Address input element not found");
    }
  };

  useEffect(() => {
    const accessList = async () => {
      try {
        const addressList = await contract.shareAccess();
        let select = document.querySelector("#selectNumber");
        if (select) {
          const options = addressList;
          for (let i = 0; i < options.length; i++) {
            let opt = options[i];
            let e1 = document.createElement("option");
            e1.textContent = opt;
            e1.value = opt;
            select.appendChild(e1);
          }
        } else {
          console.error("Select element not found");
        }
      } catch (error) {
        console.error("Error fetching access list:", error);
      }
    };
    contract && accessList();
  }, [contract]);

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded shadow-lg">
          <div className="text-center">
            <h2 className="text-xl font-bold">Share with</h2>
          </div>
          <div className="mt-4">
            <input
              type="text"
              className="address border p-2 w-full"
              placeholder="Enter Address"
            />
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
            <button
              onClick={sharing}
              className="bg-blue-500 text-white p-2 rounded mr-2"
            >
              Share
            </button>
            <button
              onClick={revoking}
              className="bg-yellow-500 text-white p-2 rounded"
            >
              Revoke
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
