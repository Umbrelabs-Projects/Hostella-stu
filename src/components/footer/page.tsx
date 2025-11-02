import React from "react";
import Image from "next/image";
import Link from "next/link";
import { footerSections } from "@/lib/constants";
import { images } from "@/lib/images";

export default function Footer() {
  return (
    <footer className="bg-[#0E0B0B] border-t border-green-100 py-10 text-slate-700 font-poppins">
      <div className="max-width-wrapper px-4">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12">
          {/* Logo */}
          <div className="space-y-3 lg:col-span-3">
            <Image
              src={images.hostellaLogo}
              width={100}
              height={80}
              alt="HostellaLOGO"
            />
            <p className="text-sm max-w-60 text-white">
              Your gateway to amazing hostel experiences
            </p>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section, index) => (
            <div key={index} className="flex flex-col gap-3 lg:col-span-2">
              <h4 className="font-semibold text-yellow-500">{section.title}</h4>

              {section.links?.map((link, linkIndex) => (
                <Link
                  key={linkIndex}
                  className="text-sm text-white hover:text-yellow-400 transition-colors"
                  href={link.link}
                >
                  {link.text}
                </Link>
              ))}

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
                        width={18}
                        height={18}
                        className="hover:opacity-70 transition-opacity"
                      />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="mt-10 text-sm text-white text-center">
          © 2025 Hostella. Book easy, book smart.
        </div>
      </div>
    </footer>
  );
}
