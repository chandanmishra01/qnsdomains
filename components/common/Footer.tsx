import Link from "next/link";
import React from "react";
import Image from "next/image";

type Props = {};

function Footer({}: Props) {
  return (
    <footer className="container mx-auto px-4 my-10 md:my-5">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-5">
        {/* Logo and Name */}
        <div className="w-full md:w-auto">
          <Link
            href={"/"}
            className="flex items-center justify-center md:justify-start gap-2 w-fit mx-auto md:mx-0"
          >
<Image src="/QNSFull.png" alt="QNS Logo" width={35} height={35} />            <p className="text-white font-medium">QnsDomains</p>
          </Link>
        </div>
        
        {/* Navigation Links */}
        {/* <div className="flex items-center gap-5 text-sm text-gray-400">
          <Link href="#" className="hover:text-gray-100 transition-colors">
            Home
          </Link>
          <Link href="#" className="hover:text-gray-100 transition-colors">
            Referral
          </Link>
          <a
            href="#"
            target="_blank"
            referrerPolicy="no-referrer"
            className="hover:text-gray-100 transition-colors"
          >
            Docs
          </a>
        </div> */}
        
        {/* Social Icons */}
        <div className="flex items-center gap-5">
          {/* <a
            href="#"
            target="_blank"
            referrerPolicy="no-referrer"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <img src="/images/icons/discord.svg" alt="Discord" className="w-4 h-4 invert" />
          </a> */}
          <a
            href="https://x.com/qnsdomains"
            target="_blank"
            referrerPolicy="no-referrer"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <img src="/images/icons/twitter.svg" alt="Twitter" className="w-4 h-4 invert" />
          </a>
          {/* <a
            href="#"
            target="_blank"
            referrerPolicy="no-referrer"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <img src="/images/icons/telegram.svg" alt="Telegram" className="w-4 h-4 invert" />
          </a> */}
        </div>
      </div>
      
      <div className="my-4 h-px bg-gray-800"></div>
      
      <div className="text-center md:text-left text-gray-400">
        &copy; {new Date().getFullYear()} Built by{" "}
        <a
          href="#"
          target="_blank"
          referrerPolicy="no-referrer"
          rel="dofollow"
          className="text-white hover:text-gray-300 transition-colors"
        >
          QnsDomians
        </a>
      </div>
    </footer>
  );
}

export default Footer;