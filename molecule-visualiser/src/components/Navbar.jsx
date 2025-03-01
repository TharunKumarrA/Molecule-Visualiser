import { useState } from "react";
import { Link } from "react-router-dom";
import { SiMoleculer } from "react-icons/si";
import { FiMenu, FiX } from "react-icons/fi";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-[#141414] text-white font-inter">
      <div className="flex justify-between items-center w-full h-20 px-6 lg:px-12">
        <div className="flex items-center text-2xl font-light">
          <Link to="/" className="flex items-center space-x-2">
            <SiMoleculer className="text-[#2ABD91] text-4xl" />
            <span>MOLECULE VISUALIZER</span>
          </Link>
        </div>

        <div className="hidden lg:flex space-x-8 text-lg">
          <Link to="/" className="hover:text-[#2ABD91]">
            VISUALIZER
          </Link>
          <Link to="/teams" className="hover:text-[#2ABD91]">
            TEAM
          </Link>
          <a
            target="_blank"
            href="https://docs.google.com/document/d/1-CaxNnUyd82sx9O1TEZEkHnVVooVond2aKkf7o9au8w/edit?usp=sharing"
            className="hover:text-[#2ABD91]"
            rel="noreferrer"
          >
            DOCUMENTATION
          </a>
        </div>

        <button
          className="lg:hidden text-3xl focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {isOpen && (
        <div className="lg:hidden flex flex-col items-center space-y-6 text-lg bg-[#1a1a1a] py-6">
          <Link
            to="/"
            className="hover:text-[#2ABD91]"
            onClick={() => setIsOpen(false)}
          >
            VISUALIZER
          </Link>
          <a
            target="_blank"
            href="https://docs.google.com/document/d/1-CaxNnUyd82sx9O1TEZEkHnVVooVond2aKkf7o9au8w/edit?usp=sharing"
            className="hover:text-[#2ABD91]"
            rel="noreferrer"
          >
            DOCUMENTATION
          </a>
          <Link
            to="/teams"
            className="hover:text-[#2ABD91]"
            onClick={() => setIsOpen(false)}
          >
            TEAM
          </Link>
        </div>
      )}
    </div>
  );
}
