// Footer.jsx
import React from "react";
import LogoImg from "../Image/Logo.png"
const Footer = () => {
  return (
    <footer className="bg-[#0a1d55] text-white pt-10 px-5 md:px-20">
      <div className="flex flex-wrap justify-between gap-10">
        {/* Logo & Description */}
        <div className="flex-1 min-w-[200px]">
         <img src={LogoImg} alt="Profile" className="w-9 h-9 rounded-full" />
           <h3 className="text-lg font-semibold mb-2">Chat App</h3>
          <p className="text-sm leading-6">
            Cheat App helps streamline your tasks and productivity with real-time accuracy and
            efficiency.
          </p>
        </div>

        {/* Company Links */}
        <div className="flex-1 min-w-[200px]">
          <h4 className="text-md font-semibold mb-2">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="text-[#cbd5e1] hover:underline">About</a></li>
            <li><a href="#" className="text-[#cbd5e1] hover:underline">Meet the Team</a></li>
            <li><a href="#" className="text-[#cbd5e1] hover:underline">Privacy Policy</a></li>
            <li><a href="#" className="text-[#cbd5e1] hover:underline">Terms and Condition</a></li>
          </ul>
        </div>

        {/* Helpful Links */}
        <div className="flex-1 min-w-[200px]">
          <h4 className="text-md font-semibold mb-2">Helpful Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="text-[#cbd5e1] hover:underline">Home</a></li>
            <li><a href="#" className="text-[#cbd5e1] hover:underline">Product</a></li>
            <li><a href="#" className="text-[#cbd5e1] hover:underline">About Us</a></li>
            <li><a href="#" className="text-[#cbd5e1] hover:underline">Blog</a></li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div className="flex-1 min-w-[200px]">
          <h4 className="text-md font-semibold mb-2">Follow Us</h4>
          <p className="text-sm mb-1">Contact Number: 9826872678</p>
          <p className="text-sm mb-3">Email Address: rpxingh201@gmail.com</p>
          <div className="flex space-x-3">
            <a href="#" target="_blank" rel="noreferrer">
              <img
                src="https://cdn-icons-png.flaticon.com/512/733/733547.png"
                alt="Facebook"
                className="w-5 h-5"
              />
            </a>
            <a href="#" target="_blank" rel="noreferrer">
              <img
                src="https://cdn-icons-png.flaticon.com/512/733/733579.png"
                alt="X"
                className="w-5 h-5"
              />
            </a>
            <a href="#" target="_blank" rel="noreferrer">
              <img
                src="https://cdn-icons-png.flaticon.com/512/1384/1384063.png"
                alt="Instagram"
                className="w-5 h-5"
              />
            </a>
            <a href="#" target="_blank" rel="noreferrer">
              <img
                src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png"
                alt="YouTube"
                className="w-5 h-5"
              />
            </a>
            <a href="#" target="_blank" rel="noreferrer">
              <img
                src="https://cdn-icons-png.flaticon.com/512/145/145807.png"
                alt="LinkedIn"
                className="w-5 h-5"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-blue-900 mt-6 pt-4 flex flex-col md:flex-row justify-between text-sm text-[#cbd5e1]">
        <p>© 2025 Global Tech Corporation</p>
        <div className="flex space-x-3 mt-2 md:mt-0">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <span>|</span>
          <a href="#" className="hover:underline">Terms of Service</a>
          <span>|</span>
          <a href="#" className="hover:underline">Support</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
