import { Mail, Phone, MapPin, Share2, ExternalLink } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-secondary-900 text-white mt-20">
      <div className="container-x py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                SH
              </div>
              SmartHire
            </h3>
            <p className="text-secondary-300 text-sm">
              Intelligent recruitment platform powered by AI to streamline your hiring process.
            </p>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-secondary-300">
              <li><a  className="hover:text-white transition-colors">About Us</a></li>
              <li><a  className="hover:text-white transition-colors">Blog</a></li>
              <li><a  className="hover:text-white transition-colors">Careers</a></li>
              <li><a  className="hover:text-white transition-colors">Press</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-secondary-300">
              <li><a  className="hover:text-white transition-colors">Documentation</a></li>
              <li><a  className="hover:text-white transition-colors">API Reference</a></li>
              <li><a  className="hover:text-white transition-colors">Support</a></li>
              <li><a  className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-secondary-300">
              <li className="flex items-center gap-2">
                <Mail size={16} /> support@smarthire.com
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} /> (+91) 123-456-7890
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} /> Gorakhpur, Uttar Pradesh, India
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-secondary-800 py-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 ">
          <p className="text-secondary-400 text-sm">
            © 2026 SmartHire. All rights reserved.
          </p>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
