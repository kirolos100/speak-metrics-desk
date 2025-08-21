const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <div>
              <h1 className="text-sm font-semibold">Link</h1>
              <p className="text-xs text-gray-400">Development</p>
            </div>
          </div>
          <p className="text-sm text-gray-400">
            Copyright 2025 All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;