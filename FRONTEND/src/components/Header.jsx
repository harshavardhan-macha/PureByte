import LoginButton from "./LoginButton";
import logo from "../assets/logo.png";
import { NavLink } from "react-router-dom";
function Header() {
  return (
<header className="flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 py-3 gap-4">
  <div className="flex items-center gap-2">
    <img src={logo} alt="logo" className="w-8 h-8" />
    <h1 className="text-3xl font-bold text-green-500">
      PureByte
    </h1>
  </div>

  
  <nav className="flex items-center gap-6 text-base">
    
    <NavLink to="/" className={({isActive}) => isActive ? "text-green-500 border-b-2 border-green-500" : "hover:text-green-500 "} >Home</NavLink>
     <NavLink to="/features" className={({isActive}) => isActive ? "text-green-500 border-b-2 border-green-500" : "hover:text-green-500 "} >Features </NavLink>
    <NavLink to="/Works" className={({isActive}) => isActive ? "text-green-500 border-b-2 border-green-500" : "hover:text-green-500 whitespace-nowrap"}  >How It Works</NavLink>
    <NavLink to="/community" className={({isActive}) => isActive ? "text-green-500 border-b-2 border-green-500" : "hover:text-green-500 "} >Community</NavLink>
    <NavLink to="/About" className={({isActive}) => isActive ? "text-green-500 border-b-2 border-green-500" : "hover:text-green-500 whitespace-nowrap "} >About Us </NavLink>
    <LoginButton />
  </nav>
</header>
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
  
