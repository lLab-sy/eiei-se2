"use client";

import { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Clock,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";

const Footer: FC = () => {
  return (
    <footer className="bg-blue-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">About Us</h3>
            <p className="text-gray-300 text-sm">
              BualoiDev connects creative talents with producers, making it
              easier to find and collaborate on media projects.
            </p>
            <Link
              href="/about"
              className="block text-sm hover:text-gray-300 transition-colors"
            >
              Learn More
            </Link>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/faq"
                  className="text-sm hover:text-gray-300 transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm hover:text-gray-300 transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm hover:text-gray-300 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="text-sm hover:text-gray-300 transition-colors"
                >
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>nasmeen12@gmail.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+66 123 456 789</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>Bangkok, Thailand</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 flex-shrink-0" />
                  <span>Working Hours:</span>
                </div>
                <div className="pl-6 text-sm">
                  <p>Mon - Fri: 5:00 - 23:00</p>
                  <p>Sat - Sun: 1:00 - 23:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Follow Us</h3>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-400 transition-colors"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors"
              >
                <Twitter className="w-6 h-6" />
              </a>
            </div>
            <div className="pt-4">
              {/* <h4 className="text-sm font-semibold mb-2">Download Our App</h4> */}
              <div className="flex gap-2">
                <Link
                  href="#"
                  className="opacity-80 hover:opacity-100 transition-opacity"
                >
                  {/* <Image
                    src="/api/placeholder/120/40"
                    alt="Download on App Store"
                    width={120}
                    height={40}
                    className="rounded"
                  /> */}
                </Link>
                <Link
                  href="#"
                  className="opacity-80 hover:opacity-100 transition-opacity"
                >
                  {/* <Image
                    src="/api/placeholder/120/40"
                    alt="Get it on Google Play"
                    width={120}
                    height={40}
                    className="rounded"
                  /> */}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-blue-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-center md:text-left">
              © {new Date().getFullYear()} BualoiDev. All rights reserved.
            </p>
            <div className="flex gap-4 text-sm">
              <Link
                href="/terms"
                className="hover:text-gray-300 transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="hover:text-gray-300 transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/cookies"
                className="hover:text-gray-300 transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
