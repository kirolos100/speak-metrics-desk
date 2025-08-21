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
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Link</h1>
              <p className="text-xs text-gray-500">Development</p>
            </div>
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
              <Link to="/upload">Upload Records</Link>
            </Button>
            <Button 
              variant={isActive("/") ? "default" : "ghost"}
              className={isActive("/") ? "" : "text-gray-600 hover:text-gray-900"}
              asChild
            >
              <Link to="/">Dashboard</Link>
            </Button>
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
              Calls JSON
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;