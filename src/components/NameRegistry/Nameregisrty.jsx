import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import MNS_ABI from "../../../artifacts/contracts/NameRegistry.sol/NameRegistry.json";

function NameRegistry() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [registrationStatus, setRegistrationStatus] = useState("");
  const [contract, setContract] = useState(null);
  const [registrationPrice, setRegistrationPrice] = useState(null);
  const [metadataUri, setMetadataUIR] = useState("");
  const [reload, setReload] = useState(false); // State variable for reloading

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contractAddress = "0x97a57C2589D5B0DeC7308bA6A26ebFf4C17a16C0";
    const mnsContract = new ethers.Contract(
      contractAddress,
      MNS_ABI.abi,
      signer
    );
    setContract(mnsContract);

    async function fetchRegistrationPrice(name) {
      try {
        const price = await mnsContract.getRegistrationPrice(name);
        setRegistrationPrice(price);
      } catch (error) {
        console.error("Error fetching registration price:", error);
      }
    }

    fetchRegistrationPrice(searchTerm);
  }, [searchTerm]);

  const handleSearch = async (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);

    if (contract) {
      try {
        const exists = await contract.nameExists(searchTerm);
        setSearchResult(exists);
      } catch (error) {
        console.error("Error checking name:", error);
      }
    }
  };

  const uploadMetadata = async () => {
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        Authorization: "4455109c-4819-40f5-9ec5-5882af32a7ed",
      },
      body: JSON.stringify({
        name: searchTerm,
        description: "nft from MNS(MODE NAME SERVICE)",
        file_url:
          "https://ipfs.io/ipfs/bafybeicwnf5nyo3ly62cfwzrvy5nptdqygdhl42aowqesmhvaojqpmfx6q",
      }),
    };
    console.log("storeing....metadata");
    try {
      const response = await fetch(
        "https://api.nftport.xyz/v0/metadata",
        options
      );
      if (response.ok) {
        const responseJson = await response.json();
        console.log("got response");

        await console.log(responseJson.metadata_uri);

        // await setMetadataUIR(responseJson.metadata_uri);

        await registerName(responseJson.metadata_uri);
      } else {
        console.error("Error uploading metadata:", response.statusText);
      }
    } catch (error) {
      console.error("Error uploading metadata:", error);
    }
  };

  const registerName = async (metadatau) => {
    try {
      // If metadataUri is generated, proceed to register

      const name = searchTerm;
      console.log(name);
      const responseUri = metadatau;

      // Remove the "ipfs://" prefix
      const ipfsPrefix = "ipfs://";
      const cid = responseUri.slice(ipfsPrefix.length);

      // Construct the updated URL
      const updatedUri = "https://ipfs.io/ipfs/" + cid;
      console.log(updatedUri);
      const tx = await contract.registerName(name, updatedUri, {
        value: registrationPrice,
      });

      await tx.wait();

      setRegistrationStatus("Name registered successfully!");
      setReload(true);
    } catch (error) {
      setRegistrationStatus("Error registering name");
      console.error("Error registering name:", error);
    }
  };
  useEffect(() => {
    // Reload the component after successful registration
    if (reload) {
      setReload(false); // Reset reload state
      window.location.reload();
    }
  }, [reload]);

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="abcd">
          <div className="abc">
            <h1 className="text-center mb-4">Grab your .mode here!</h1>
            <div className="input-group mb-3">
              <input
                type="text"
                className={`form-control ${
                  searchResult === false
                    ? "border-success"
                    : searchResult === true
                    ? "border-danger"
                    : ""
                }`}
                placeholder="Search...."
                aria-label="Search"
                aria-describedby="searchButton"
                value={searchTerm}
                onChange={handleSearch}
              />
              <span className="input-group-text">.mode</span>
            </div>
            {searchResult === false &&
              searchTerm !== "" &&
              registrationPrice !== null && (
                <div>
                  <p className="text-success mt-2">
                    {searchTerm + ".mode"} is available!
                  </p>
                  <p>
                    Registration Price:{" "}
                    {ethers.utils.formatEther(registrationPrice)} Ether
                  </p>
                  <button
                    className="btn btn-success mt-2"
                    onClick={() => uploadMetadata()}
                  >
                    Register Name
                  </button>
                </div>
              )}
            {registrationStatus && (
              <p
                className={`mt-2 ${
                  registrationStatus.includes("Error")
                    ? "text-danger"
                    : "text-success"
                }`}
              >
                {registrationStatus}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NameRegistry;
