import React from 'react'

function Navbar() {
  return (
    <>
         <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container d-flex justify-content-between align-items-center">
        <a className="navbar-brand" href="#">
            <h1>MNS</h1>
        </a>
        <button className="btn btn-primary">Connect Wallet</button>
      </div>
    </nav>
    </>
  )
}

export default Navbar