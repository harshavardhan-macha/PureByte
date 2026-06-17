import LoginButton from "./LoginButton";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
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
    
    <Link to="/" className="hover:text-green-500 font-semibold">Home</Link>
     <Link to="/features" className="hover:text-green-500 font-semibold">Features </Link>
    <Link to="/Works" className="hover:text-green-500 font-semibold whitespace-nowrap">How It Works</Link>
    <Link to="/community" className="hover:text-green-500 font-semibold">Community</Link>
    <Link to="/About" className="hover:text-green-500 font-semibold whitespace-nowrap">About Us </Link>
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
  
