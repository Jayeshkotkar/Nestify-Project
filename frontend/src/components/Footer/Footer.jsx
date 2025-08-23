import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="ft-brand">
            <div className="brand">WonderLust</div>
            <p className="brand-sub">
              Book unique stays around the world. Handpicked homes, seamless checkout, and secure payments.
            </p>
          </div>

          <nav className="ft-links" aria-label="Footer navigation">
            <div className="col">
              <div className="col-title">Company</div>
              <a href="#">About</a>
              <a href="#">Careers</a>
              <a href="#">Press</a>
              <a href="#">Contact</a>
            </div>
            <div className="col">
              <div className="col-title">Explore</div>
              <a href="#">Destinations</a>
              <a href="#">Top-rated</a>
              <a href="#">Last minute</a>
              <a href="#">Host your home</a>
            </div>
            <div className="col">
              <div className="col-title">Support</div>
              <a href="#">Help center</a>
              <a href="#">Cancellation options</a>
              <a href="#">Safety</a>
              <a href="#">Report issue</a>
            </div>
          </nav>
        </div>

        <div className="footer-divider" />

        <div className="footer-bottom">
          <div className="footer-social" aria-label="Social links">
            <a href="#" aria-label="Facebook" title="Facebook">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M22 12.06C22 6.48 17.52 2 11.94 2S2 6.48 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H8.4v-2.9h2.04V9.84c0-2.02 1.2-3.13 3.04-3.13.88 0 1.8.16 1.8.16v1.98h-1.01c-1 0-1.32.62-1.32 1.26v1.51h2.24l-.36 2.9h-1.88V22c4.78-.79 8.45-4.94 8.45-9.94z" />
              </svg>
            </a>
            <a href="#" aria-label="Instagram" title="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5A5.5 5.5 0 1 1 6.5 13 5.5 5.5 0 0 1 12 7.5zm0 2A3.5 3.5 0 1 0 15.5 13 3.5 3.5 0 0 0 12 9.5zM18 6.75a1 1 0 1 1-1 1 1 1 0 0 1 1-1z" />
              </svg>
            </a>
            <a href="#" aria-label="LinkedIn" title="LinkedIn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M4.98 3.5A2.5 2.5 0 1 1 2.5 6 2.49 2.49 0 0 1 4.98 3.5zM3 8.25h3.96V21H3zM9.75 8.25H13v1.73h.05a3.55 3.55 0 0 1 3.2-1.76c3.43 0 4.07 2.26 4.07 5.2V21h-3.96v-5.35c0-1.27 0-2.9-1.77-2.9-1.78 0-2.05 1.38-2.05 2.8V21H9.75z" />
              </svg>
            </a>
          </div>

          <div className="footer-email">
            <a href="mailto:jayeshkotkar01@gmail.com" title="Email Jayesh" aria-label="Email Jayesh">
              jayeshkotkar01@gmail.com
            </a>
          </div>

          <div className="footer-copy">© {new Date().getFullYear()} WonderLust Private Limited • All rights reserved</div>

          <nav className="footer-links" aria-label="Legal links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Sitemap</a>
            <a href="#">Company Details</a>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;