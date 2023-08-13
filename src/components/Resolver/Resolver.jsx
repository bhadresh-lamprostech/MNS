import React, { useState } from "react";
import { ethers } from "ethers";
import MNS from "../../../artifacts/contracts/NameRegistry.sol/NameRegistry.json";

const Resolver = () => {
  const contractAddress = "0x97a57C2589D5B0DeC7308bA6A26ebFf4C17a16C0"; // Replace with the actual contract address
  const contractAbi = MNS.abi;

  const [name, setName] = useState("");
  const [resolvedAddress, setResolvedAddress] = useState(null);
  const [isResolved, setIsResolved] = useState(false);

  const resolveName = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        contractAddress,
        contractAbi,
        provider
      );
      var inputName = name;
      var splicedName = inputName.replace(".mode", "");

      console.log(splicedName);

      const address = await contract.resolveName(splicedName);
      setResolvedAddress(address);
      setIsResolved(true);
    } catch (error) {
      console.error("Error resolving name:", error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <div className="card">
            <div className="card-header bg-primary text-white">
              Name Resolver
            </div>
            <div className="card-body">
              <div className="form-group">
                <label htmlFor="nameInput">Enter Name:</label>
                <input
                  type="text"
                  id="nameInput"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <button className="btn btn-primary" onClick={resolveName}>
                  Resolve Name
                </button>
              </div>
              {isResolved && (
                <div className="form-group">
                  <label htmlFor="resolvedAddressDropdown">
                    Resolved Address:
                  </label>
                  <select id="resolvedAddressDropdown" className="form-control">
                    <option value={resolvedAddress}>{resolvedAddress}</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resolver;
