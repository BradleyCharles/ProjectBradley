import React from "react";
import "@/styles/footer.css";

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <p>
          &copy; {new Date().getFullYear()} Bradley Charles. All rights
          reserved.{" "}
          <a
            href="https://github.com/BradleyCharles/ProjectBradley"
            target="_blank"
            rel="noopener noreferrer"
          >
            Source
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
