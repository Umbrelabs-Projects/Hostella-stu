import React from "react";
import Image from "next/image";
import Link from "next/link";

import { footerSections } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-[#003E23] py-5 text-white font-poppins">
      <div className="max-width-wrapper px-4">
        <div className="mt-10 grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12">
          {/* Logo */}
          <div className="space-y-2 lg:col-span-3">
            <Image
              src="/assets/svgs/logo.svg"
              width={100}
              height={80}
              alt="MechAfricaLOGO"
            />
            <p className="text-sm max-w-60">MechAfrica</p>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section, index) => (
            <div key={index} className="flex flex-col gap-3 lg:col-span-2">
              <h4 className=" font-medium tracking-tight">{section.title}</h4>

              {/* Normal text links */}
              {section.links?.map((link, linkIndex) => (
                <Link
                  key={linkIndex}
                  className="text-sm text-[#739C7F] hover:underline"
                  href={link.link}
                >
                  {link.text}
                </Link>
              ))}

              {/* Social Icons */}
              {section.iconLink && (
                <div className="flex gap-4 mt-2">
                  {section.iconLink.map((iconItem, iconIndex) => (
                    <Link
                      key={iconIndex}
                      href={iconItem.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        src={iconItem.icon}
                        alt="social"
                        width={15}
                        height={15}
                        className="hover:opacity-80 transition-opacity"
                      />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer copyright */}
        <div className="mt-10 text-sm text-[#DFDFDF] text-center">
          Copyright © 2025 MechAfrica. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
