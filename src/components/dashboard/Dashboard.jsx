import React, { useEffect, useState } from "react";
import Navbar from "../navbar/Navbar";
import Nameregistry from "../NameRegistry/Nameregisrty";
import { useAccount } from "wagmi";
import MNS from "../../../artifacts/contracts/NameRegistry.sol/NameRegistry.json";
import { ethers } from "ethers"; // Import ethers.js
import CardComponent from "../Cardcomponent/Cardcomponent";
import Resolver from "../Resolver/Resolver";

const Dashboard = () => {
  const { address } = useAccount();
  const contractAddress = "0x97a57C2589D5B0DeC7308bA6A26ebFf4C17a16C0"; // Replace with the actual contract address
  const contractAbi = MNS.abi; // Use the ABI from the imported MNS

  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    // Connect to the Ethereum provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    // Connect to your contract using its ABI and contract address
    const contract = new ethers.Contract(
      contractAddress,
      contractAbi,
      provider
    );

    // Check if the user is registered
    if (address) {
      contract
        .Registered(address)
        .then((result) => {
          setIsRegistered(result);
        })
        .catch((error) => {
          console.error("Error checking registration:", error);
        });
    }
  }, [address, contractAddress, contractAbi]);

  return (
    <div className="container-fluid">
      <Navbar />
      <main className="col-md-12 ml-sm-auto col-lg-12 px-md-4">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h1 className="h2">Dashboard</h1>
        </div>

        {/* Conditionally render Nameregisrty component */}
        {!isRegistered ? (
          <div className="row mb-4">
            <div className="col-md-12">
              <div className="p-3 bg-light">
                <div className="row">
                  <div className="col-md-4 mb-3 mx-auto">
                    <div className="card">
                      <div className="card-body">
                        <Nameregistry />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {isRegistered ? (
          <div className="row mb-4">
            <div className="col-md-12">
              <div className="p-3 bg-light">
                <div className="row">
                  <div className="col-md-8 mb-4 mx-auto">
                    <CardComponent />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        <div className="row mb-4">
          <div className="col-md-12">
            <div className="p-3 bg-light">
              <div className="row">
                <div className="col-md-8 mb-4 mx-auto">
                  <Resolver />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
