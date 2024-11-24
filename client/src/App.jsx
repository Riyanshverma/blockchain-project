import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { ethers } from "ethers";
import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const loadProvider = async () => {
      if (provider) {
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });

        try {
          await provider.send("eth_requestAccounts", []);
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          setAccount(address);
          let contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

          const contract = new ethers.Contract(
            contractAddress,
            Upload.abi,
            signer
          );

          setContract(contract);
          setProvider(provider);
        } catch (error) {
          console.error("Error loading provider:", error);
        }
      } else {
        console.error("Metamask is not installed");
      }
    };

    provider && loadProvider();
  }, []);

  return (
    <Router>
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
        <div className="text-left ">
          {!modalOpen && (
            <button
              className="bg-blue-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300 mt-2 mx-2"
              onClick={() => setModalOpen(true)}
            >
              Share Files
            </button>
          )}
          {modalOpen && (
            <Modal setModalOpen={setModalOpen} contract={contract} />
          )}
        </div>
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8">
            <h1 className="text-gray-100 text-4xl font-bold text-center mb-4">
              Decentralized Drive
            </h1>
            <p className="text-center text-gray-300">
              Account:{" "}
              {account
                ? `${account.slice(0, 6)}...${account.slice(-4)}`
                : "Not connected"}
            </p>
            <nav className="text-center">
              <Link to="/" className="text-blue-500 underline mx-2">
                Home
              </Link>
              <Link to="/display" className="text-blue-500 underline mx-2">
                Display Files
              </Link>
            </nav>
          </header>
          <main className="max-w-3xl mx-auto">
            <Routes>
              <Route
                path="/"
                element={
                  <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
                    <h2 className="text-gray-100 text-2xl font-semibold mb-4">
                      Upload Files
                    </h2>
                    <FileUpload
                      account={account}
                      provider={provider}
                      contract={contract}
                    />
                  </div>
                }
              />
              <Route
                path="/display"
                element={<Display contract={contract} account={account} />}
              />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
