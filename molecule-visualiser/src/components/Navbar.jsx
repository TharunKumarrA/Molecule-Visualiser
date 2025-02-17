import { SiMoleculer } from "react-icons/si";

export default function NavBar() {
  return (
    <div className="flex flex-row w-screen overflow-hidden h-24 text-white font-inter">
      <div className="flex flex-row w-1/2 items-center font-light text-2xl ">
        <div className="cursor-pointer"><a href="/"><SiMoleculer className="flex justify-center items-center text-[#2ABD91] mx-4 text-4xl" /></a></div>
        <div>MOLECULE VISUALIZER</div>
      </div>
      <div className="flex flex-row w-1/2 justify-end items-center font-light">
      <div className="flex mx-8 cursor-pointer hover:text-[#2ABD91]">VISUALIZER</div>
        <div className="flex mx-8 cursor-pointer hover:text-[#2ABD91]">
          <a target="blank" href="https://docs.google.com/document/d/1-CaxNnUyd82sx9O1TEZEkHnVVooVond2aKkf7o9au8w/edit?usp=sharing" className="hover:text-[#2ABD91]">DOCUMENTATION</a>
        </div>
        <div className="flex mx-8 cursor-pointer hover:text-[#2ABD91]">TEAM</div>
      </div>
    </div>
  );
}
