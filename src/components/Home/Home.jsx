import React, { useState, useEffect } from "react";
import Navbar from "../navbar/Navbar";
import StartedImage from "../../assets/getStarted.png";
import "../../Styles/Home.css";
import { CSSTransition } from "react-transition-group";
import { useNavigate } from "react-router-dom";
import Spline from "@splinetool/react-spline";

// import "bootstrap/dist/css/bootstrap.min.css";

function Home() {
  const [isShaking, setIsShaking] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setIsShaking((prevShaking) => !prevShaking);
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <div className="row align-items-center">
          <CSSTransition
            in={true}
            appear={true}
            timeout={1000}
            classNames="fade-left"
          >
            <div className="col-md-6 text-dark">
              <h1>Welcome to MNS ".mode"</h1>
              <p>
                Discover a new era of simplified blockchain interactions with
                MNS ".mode," the innovative Naming System that redefines the way
                you manage your digital assets. Designed to enhance the user
                experience within the MODE blockchain ecosystem, MNS ".mode"
                introduces a revolutionary approach to handling Ethereum EOA
                addresses.
              </p>
              <button
                className={`btn started-btn ${isShaking ? "shake" : ""}`}
                style={{
                  backgroundColor: "#00FF85",
                  color: "black",
                  fontWeight: "650",
                }}
                onClick={() => navigate("/dashboard")}
              >
                Get Started
              </button>
            </div>
          </CSSTransition>
          <CSSTransition
            in={true}
            appear={true}
            timeout={1000}
            classNames="fade-right"
          >
            <div className="col-md-6 d-flex justify-content-end">
              {/* <img
                src={StartedImage}
                alt="Image"
                className="img-fluid"
                height={500}
                width={500}
              /> */}
              <Spline scene="https://prod.spline.design/WsCTojYIz15S9fCG/scene.splinecode" />
            </div>
          </CSSTransition>
        </div>
        <div className="row align-items-center">
          <CSSTransition
            in={true}
            appear={true}
            timeout={1000}
            classNames="fade-left"
          >
            <div className="col-md-6 d-flex justify-content-end">
              <img
                src={StartedImage}
                alt="Image"
                className="img-fluid"
                height={500}
                width={500}
              />
            </div>
          </CSSTransition>
          <CSSTransition
            in={true}
            appear={true}
            timeout={1000}
            classNames="fade-right"
          >
            <div className="col-md-6 text-dark">
              <h1>Welcome to MNS ".mode"</h1>
              <p>
                Discover a new era of simplified blockchain interactions with
                MNS ".mode," the innovative Naming System that redefines the way
                you manage your digital assets. Designed to enhance the user
                experience within the MODE blockchain ecosystem, MNS ".mode"
                introduces a revolutionary approach to handling Ethereum EOA
                addresses.
              </p>
            </div>
          </CSSTransition>
        </div>

        {/* FAQ Section */}
        <div className="row mt-5">
          <div className="col-md-12">
            <h2>Frequently Asked Questions</h2>
            <div className="accordion" id="faqAccordion">
              <div className="accordion-item">
                <h3 className="accordion-header" id="faqHeading1">
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#faqCollapse1"
                    aria-expanded="true"
                    aria-controls="faqCollapse1"
                  >
                    What is MNS ".mode"?
                  </button>
                </h3>
                <div
                  id="faqCollapse1"
                  className="accordion-collapse collapse show"
                  aria-labelledby="faqHeading1"
                  data-bs-parent="#faqAccordion"
                >
                  <div className="accordion-body">
                    MNS ".mode" is a revolutionary Naming System project that
                    simplifies blockchain transactions by allowing users to
                    associate personalized name handles with their Ethereum EOA
                    addresses.
                  </div>
                </div>
              </div>
              {/* You can add more FAQ items here */}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer py-4">
        <div className="container">
          <div className="text-center">
            <p>&copy; 2023 MNS ".mode" All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Home;
