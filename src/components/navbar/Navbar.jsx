import React from "react";
import { ConnectKitButton } from "connectkit";

function Navbar() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container d-flex justify-content-between align-items-center">
          <a className="navbar-brand" href="#">
            <h1>MNS</h1>
          </a>
          <ConnectKitButton />
        </div>
      </nav>
    </>
  );
}

export default Navbar;
