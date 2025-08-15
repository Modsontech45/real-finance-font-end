import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white/5 backdrop-blur-sm border-t border-white/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2 text-white/70">
            <span className="text-sm">Powered by</span>
            <span className="text-sm font-semibold text-white">Synctuario</span>
            <Heart className="w-4 h-4 text-red-400" />
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-white/60">
            <span>© 2024 FinanceTracker</span>
            <a 
              href="#" 
              className="hover:text-white/80 transition-colors"
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              className="hover:text-white/80 transition-colors"
            >
              Terms of Service
            </a>
            <a 
              href="#" 
              className="hover:text-white/80 transition-colors"
            >
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;