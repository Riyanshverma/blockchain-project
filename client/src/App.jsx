import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";


function App() {

  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum); /* Helps in interacting with metamask. */

    const loadProvider = async () => {
      if (provider) {

        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        let contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

        const contract = new ethers.Contract(
          contractAddress,
          Upload.abi,
          signer
        );

        // console.log(contract);
        setContract(contract);
        setProvider(provider);
      }
      else {
        console.error("Metamask is not installed");
      }
    }
    provider && loadProvider();

  }, [])

  return (
    <>
      <div class="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8">
            <h1 className="text-gray-100 text-4xl font-bold text-center mb-4">Gdrive 3.0</h1>
            <p className="text-center text-gray-300">
              Account: {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "Not connected"}
            </p>
          </header>

          <main className="max-w-3xl mx-auto">
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-gray-100 text-2xl font-semibold mb-4">Upload Files</h2>
              <FileUpload account={account} provider={provider} contract={contract} />
            </div>

            <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-gray-100 text-2xl font-semibold mb-4">Your Files</h2>
              <Display contract={contract} account={account} />
            </div>

            <div className="text-center">
              {!modalOpen && (
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                  onClick={() => setModalOpen(true)}
                >
                  Share Files
                </button>
              )}
              {modalOpen && <Modal setModalOpen={setModalOpen} contract={contract} />}
            </div>
          </main>
        </div>
      </div>

    </>
  );
}

export default App;
