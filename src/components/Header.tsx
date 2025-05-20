
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X, Menu } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Mock login state - in a real app this would come from auth context
  const toggleAuthState = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-gradient">AI Humanizer</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-humanizer-dark font-medium hover:text-humanizer-purple transition-colors">
            Home
          </Link>
          <Link to="/pricing" className="text-humanizer-dark font-medium hover:text-humanizer-purple transition-colors">
            Pricing
          </Link>
          <Link to="/contact" className="text-humanizer-dark font-medium hover:text-humanizer-purple transition-colors">
            Contact
          </Link>
          {isLoggedIn && (
            <Link to="/dashboard" className="text-humanizer-dark font-medium hover:text-humanizer-purple transition-colors">
              Dashboard
            </Link>
          )}
          <Button
            onClick={toggleAuthState}
            variant={isLoggedIn ? "outline" : "default"}
            className={isLoggedIn ? "" : "bg-gradient-purple-blue"}
          >
            {isLoggedIn ? "Logout" : "Login"}
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button variant="ghost" onClick={() => setIsMenuOpen(!isMenuOpen)} size="sm">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-200 animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link 
              to="/" 
              className="text-humanizer-dark font-medium hover:text-humanizer-purple transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/pricing" 
              className="text-humanizer-dark font-medium hover:text-humanizer-purple transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              to="/contact" 
              className="text-humanizer-dark font-medium hover:text-humanizer-purple transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            {isLoggedIn && (
              <Link 
                to="/dashboard" 
                className="text-humanizer-dark font-medium hover:text-humanizer-purple transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            <Button
              onClick={() => {
                toggleAuthState();
                setIsMenuOpen(false);
              }}
              variant={isLoggedIn ? "outline" : "default"}
              className={`w-full ${isLoggedIn ? "" : "bg-gradient-purple-blue"}`}
            >
              {isLoggedIn ? "Logout" : "Login"}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
