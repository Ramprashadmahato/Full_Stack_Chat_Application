import { Link,} from "react-router-dom";
import LogoImg from "../Image/Logo.png";

const Navbar = () => {
  return (
    <header className="w-full border-b border-gray-200 bg-white  dark:bg-gray-900 dark:text-white transition-colors duration-300 relative">
     

      <div className="max-w-7xl mx-auto px-4 ">
        <div className="flex justify-between items-center h-16 gap-4">
          <div className="flex items-center gap-4 flex-1">
            <Link to="/">
              <img src={LogoImg} alt="Logo" className="w-9 h-9 rounded-full" />
            </Link>

            <Link to="/" className="nav-link font-medium text-gray-600 hover:text-black dark:hover:text-white">Home</Link>
            
            <Link to="/chat" className="nav-link font-medium text-gray-600 hover:text-black dark:hover:text-white">Chat</Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
