import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-2">
          {/* <span className="text-xl font-bold text-blue-500">
            CareerNest
          </span> */}
           <img className="size-5" src="/bird.svg" alt="Logo" />
          Career<span className="text-orange-600">Nest</span>
          <span className="text-sm flex items-center text-gray-400">
            © 2025
          </span>
        </div>

        {/* Links */}
        <div className="flex gap-6 text-sm">
          <Link to="/about" className="hover:text-blue-400 transition">
            About
          </Link>
          <Link to="/contact" className="hover:text-blue-400 transition">
            Contact
          </Link>
          <Link to="/privacypolicy" className="hover:text-blue-400 transition">
            Privacy Policy
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-sm text-gray-400">
          All rights reserved
        </div>
      </div>
    </footer>
  );
};

export default Footer;
