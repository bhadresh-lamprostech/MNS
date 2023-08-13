import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { formatEther } from "ethers/lib/utils";
import MNS from "../../../artifacts/contracts/NameRegistry.sol/NameRegistry.json";

const CardComponent = () => {
  const { address } = useAccount();
  const contractAddress = "0x97a57C2589D5B0DeC7308bA6A26ebFf4C17a16C0"; // Replace with the actual contract address
  const contractAbi = MNS.abi;

  const [nameDetails, setNameDetails] = useState({
    nameValue: "",
    creationTimestamp: 0,
    registrationPrice: 0,
    expiryTimestamp: 0,
    tokenURIValue: "",
  });

  const [tokenUriDetails, setTokenUriDetails] = useState(null);

  useEffect(() => {
    const fetchNameDetails = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(
          contractAddress,
          contractAbi,
          provider
        );

        if (address) {
          const result = await contract.getNameByAddress(address);
          setNameDetails({
            nameValue: result[0],
            creationTimestamp: result[1],
            registrationPrice: result[2],
            expiryTimestamp: result[3],
            tokenURIValue: result[4],
          });
        }
      } catch (error) {
        console.error("Error fetching name details:", error);
      }
    };

    fetchNameDetails();
  }, [address, contractAddress, contractAbi]);

  useEffect(() => {
    if (nameDetails.tokenURIValue) {
      fetch(nameDetails.tokenURIValue)
        .then((response) => response.json())
        .then((data) => setTokenUriDetails(data))
        .catch((error) =>
          console.error("Error fetching token URI details:", error)
        );
    }
  }, [nameDetails.tokenURIValue]);

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-primary text-white">Name Details</div>
      <div className="card-body">
        <div className="d-flex">
          <div className="flex-grow-1">
            <p className="card-text">
              <strong>Name:</strong> {nameDetails.nameValue}.mode
            </p>
            <p className="card-text">
              <strong>Creation Timestamp:</strong>{" "}
              {new Date(nameDetails.creationTimestamp * 1000).toLocaleString()}
            </p>
            <p className="card-text">
              <strong>Registration Price:</strong>{" "}
              {formatEther(nameDetails.registrationPrice)} ETH
            </p>
            <p className="card-text">
              <strong>Expiry Timestamp:</strong>{" "}
              {new Date(nameDetails.expiryTimestamp * 1000).toLocaleString()}
            </p>
          </div>
          <div className="token-uri-details">
            {tokenUriDetails && (
              <div>
                <p className="token-uri-title">
                  <strong>NFT Details of MNS:</strong>
                </p>
                <p>
                  <strong>Name:</strong> {tokenUriDetails.name}.mode
                </p>
                <p>
                  <strong>Description:</strong> {tokenUriDetails.description}
                </p>
                <p>
                  <strong>Image:</strong>
                </p>
                <div className="d-flex align-items-center">
                  <img
                    src={tokenUriDetails.image}
                    alt="NFT"
                    className="img-thumbnail"
                    style={{ maxWidth: "100px" }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardComponent;
