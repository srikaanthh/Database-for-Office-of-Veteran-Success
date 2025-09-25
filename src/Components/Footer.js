import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-gray-50 border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between">
        {/* Left side */}
        <div className="text-sm text-gray-600 mb-4 md:mb-0">
          © {new Date().getFullYear()} Office of Veteran Success · University of South Florida
        </div>

        {/* Right side */}
        <div className="flex space-x-6 text-sm">
          <a
            href="https://www.usf.edu/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-[#006747] transition-colors duration-200"
          >
            USF Website
          </a>
          <a
            href="mailto:ovs@usf.edu"
            className="text-gray-600 hover:text-[#006747] transition-colors duration-200"
          >
            Contact
          </a>
          <a
            href="https://www.usf.edu/about-usf/administrative-units/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-[#006747] transition-colors duration-200"
          >
            Admin Units
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
