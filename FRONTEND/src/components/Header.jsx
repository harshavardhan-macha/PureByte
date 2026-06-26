import LoginButton from "./LoginButton";
import logo from "../assets/logo.png";
import { NavLink } from "react-router-dom";
import {useState} from "react";
import {Menu} from "lucide-react";
function Header() {
  const[isMenuOpen,setIsMenuOpen] = useState(false);
  return (
    <>
 <header className="flex  items-center justify-between flex-col md:flex-row px-4 sm:px-6 py-3 gap-4 ">  
  <div className="flex items-center gap-2">
    <img src={logo} alt="logo" className="w-8 h-8" />
    <h1 className="text-3xl font-bold text-green-500"> 
      PureByte 
    </h1>
  </div>
  
  <nav className="hidden  md:flex items-center gap-6 text-base">
    
    <NavLink to="/" className={({isActive}) => isActive ? "text-green-500 border-b-2 border-green-500" : "hover:text-green-500 "} >Home</NavLink>
     <NavLink to="/features" className={({isActive}) => isActive ? "text-green-500 border-b-2 border-green-500" : "hover:text-green-500 "} >Features </NavLink>
    <NavLink to="/Works" className={({isActive}) => isActive ? "text-green-500 border-b-2 border-green-500" : "hover:text-green-500 "}  >How It Works</NavLink>
    <NavLink to="/community" className={({isActive}) => isActive ? "text-green-500 border-b-2 border-green-500" : "hover:text-green-500 "} >Community</NavLink>
    <NavLink to="/About" className={({isActive}) => isActive ? "text-green-500 border-b-2 border-green-500" : "hover:text-green-500 "} >About Us </NavLink>
    <LoginButton />
  </nav>
  < div className="flex items-center gap-3 md:hidden">
  <button className="md:hidden" 
  onClick={() => setIsMenuOpen(!isMenuOpen)}>
      <Menu size={28} /> 
  </button>
  <LoginButton />
  </div>
  
  
  {isMenuOpen &&(
    <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setIsMenuOpen(false)}/>
  )}
  <div className={`fixed top-0 right-0 h-full w-72 bg-white  z-50  transform transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "translate-x-full" }`}>
    <nav className="md:hidden mt-4 flex flex-col gap-4 text-base bg-White Rounded-lg shadow-md text-green-500 p-4">
      <NavLink to="/" onClick={() => setIsMenuOpen(false)} >Home</NavLink>
      <NavLink to="/features" onClick={() => setIsMenuOpen(false)}>Features</NavLink>
      <NavLink to="/Works" onClick={() => setIsMenuOpen(false)}>How it Works </NavLink>
      <NavLink to="/community" onClick={() => setIsMenuOpen(false)}>Community</NavLink>
      <NavLink to="/About" onClick={() => setIsMenuOpen(false)}>About Us</NavLink>
      </nav>
      </div>
      </header>
 </>
);
}
export default Header;
 
/* //     <header className="flex items-center px-6 py-3 gap-6">
//       <div className="flex items-center gap-2">
//         <img src={logo} alt="logo" className="w-8 h-8"/>
//       <h1 className=" text-3xl font-bold text-green-500 mr-130 px-1 py-2">
//         PureByte
//       </h1>
//       </div>
//       <nav className="flex gap-12 text-lg py-4">
//         <a href="#" className="hover:text-green-500 font-semibold"> Home</a>
//         <a href="#" className="hover:text-green-500 font-semibold">Features</a>
//         <a href="#" className="hover:text-green-500 font-semibold">How It Works</a>
//         <a href="#" className="hover:text-green-500 font-semibold">Community</a>
//         <a href="#" className="hover:text-green-500 font-semibold">About Us</a>
//        <LoginButton />
//       </nav>
       
//     </header> */
  
