import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-humanizer-dark text-white py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" onClick={() => window.scrollTo(0, 0)} className="text-2xl font-bold text-white">
              AI Humanizer
            </Link>
            <p className="mt-4 text-gray-300">
              Transform AI-generated text into human-like content effortlessly.
            </p>
          </div>

          <div className="col-span-1">
            <h3 className="font-semibold text-lg mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" onClick={() => window.scrollTo(0, 0)} className="text-gray-300 hover:text-white transition-colors">
                  AI Humanizer Tool
                </Link>
              </li>
              <li>
                <Link to="/pricing" onClick={() => window.scrollTo(0, 0)} className="text-gray-300 hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/" onClick={() => window.scrollTo(0, 0)} className="text-gray-300 hover:text-white transition-colors">
                  API
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/contact" onClick={() => window.scrollTo(0, 0)} className="text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/" onClick={() => window.scrollTo(0, 0)} className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/" onClick={() => window.scrollTo(0, 0)} className="text-gray-300 hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" onClick={() => window.scrollTo(0, 0)} className="text-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/" onClick={() => window.scrollTo(0, 0)} className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/" onClick={() => window.scrollTo(0, 0)} className="text-gray-300 hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-gray-700">
          <p className="text-gray-300 text-center">
            © {new Date().getFullYear()} AI Humanizer. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
