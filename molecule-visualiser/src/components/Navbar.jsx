import { useState } from "react";
import { SiMoleculer } from "react-icons/si";
import { FiMenu, FiX } from "react-icons/fi"; // Icons for menu toggle

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-[#141414] text-white font-inter">
      {/* Navbar Container */}
      <div className="flex justify-between items-center w-full h-20 px-6 lg:px-12">
        {/* Logo Section */}
        <div className="flex items-center text-2xl font-light">
          <a href="/" className="flex items-center space-x-2">
            <SiMoleculer className="text-[#2ABD91] text-4xl" />
            <span>MOLECULE VISUALIZER</span>
          </a>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex space-x-8 text-lg">
          <div className="cursor-pointer hover:text-[#2ABD91]">VISUALIZER</div>
          <a
            target="_blank"
            href="https://docs.google.com/document/d/1-CaxNnUyd82sx9O1TEZEkHnVVooVond2aKkf7o9au8w/edit?usp=sharing"
            className="cursor-pointer hover:text-[#2ABD91]"
            rel="noreferrer"
          >
            DOCUMENTATION
          </a>
          <div className="cursor-pointer hover:text-[#2ABD91]">TEAM</div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-3xl focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden flex flex-col items-center space-y-6 text-lg bg-[#1a1a1a] py-6">
          <div className="cursor-pointer hover:text-[#2ABD91]">VISUALIZER</div>
          <a
            target="_blank"
            href="https://docs.google.com/document/d/1-CaxNnUyd82sx9O1TEZEkHnVVooVond2aKkf7o9au8w/edit?usp=sharing"
            className="cursor-pointer hover:text-[#2ABD91]"
            rel="noreferrer"
          >
            DOCUMENTATION
          </a>
          <div className="cursor-pointer hover:text-[#2ABD91]">TEAM</div>
        </div>
      )}
    </div>
  );
}
