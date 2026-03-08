import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-darkText text-white dark:bg-gray-800 py-8 mt-12 transition-colors duration-300">
      <div className="container mx-auto px-4 text-center md:flex md:justify-between md:items-center">
        <div className="mb-4 md:mb-0">
          <h3 className="text-xl font-bold mb-2">Milkman App</h3>
          <p>&copy; 2026 All rights reserved.</p>
        </div>
        <div className="mb-4 md:mb-0">
          <h4 className="text-lg font-semibold mb-2">Contact Us</h4>
          <p>Email: support@milkmanapp.com</p>
          <p>Phone: +1 (555) 123-4567</p>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-2">Support</h4>
          <ul>
            <li><a href="#" className="hover:text-primary">FAQs</a></li>
            <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
            <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
