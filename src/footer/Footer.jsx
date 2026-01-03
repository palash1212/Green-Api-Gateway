import React from "react";
import { FaLeaf, FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-green-500 p-2 rounded-lg">
                <FaLeaf className="text-white text-xl" />
              </div>
              <h2 className="text-2xl font-bold">Green API Gateway</h2>
            </div>
            <p className="text-gray-400">
              Monitoring and optimizing API sustainability since 2026
            </p>
          </div>

          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white transition">
              <FaGithub className="text-xl" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              <FaTwitter className="text-xl" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              <FaLinkedin className="text-xl" />
            </a>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>
            © 2026 Green API Gateway. All rights reserved. | Based on research
            from "Green Computing Term Paper: A Comparative Analysis of
            Inference Phase Carbon Footprints"
          </p>
          <p className="mt-2">
            This tool helps quantify the environmental impact of API calls to
            promote sustainable software development.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
