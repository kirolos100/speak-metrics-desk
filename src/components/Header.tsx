import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="Logo" className="w-20 h-20 object-contain" />
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Button 
              variant={isActive("/calls") ? "default" : "ghost"} 
              className={isActive("/calls") ? "" : "text-gray-600 hover:text-gray-900"}
              asChild
            >
              <Link to="/calls">Calls</Link>
            </Button>
            <Button 
              variant={isActive("/upload") ? "default" : "ghost"}
              className={isActive("/upload") ? "" : "text-gray-600 hover:text-gray-900"}
              asChild
            >
              <Link to="/upload">Upload Calls</Link>
            </Button>
            <Button 
              variant={isActive("/") ? "default" : "ghost"}
              className={isActive("/") ? "" : "text-gray-600 hover:text-gray-900"}
              asChild
            >
              <Link to="/">Dashboard</Link>
            </Button>
            <Button 
              variant={isActive("/chat") ? "default" : "ghost"} 
              className={isActive("/chat") ? "" : "text-gray-600 hover:text-gray-900"}
              asChild
            >
              <Link to="/chat">Chat with Calls</Link>
            </Button>
            <Button 
              variant={isActive("/insights") ? "default" : "ghost"} 
              className={isActive("/insights") ? "" : "text-gray-600 hover:text-gray-900"}
              asChild
            >
              <Link to="/insights">AI Insights</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;