"use client";

import Image, { StaticImageData } from "next/image";

interface FeatureCardProps {
  icon: string | StaticImageData;
  title: string;
  description: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="w-[19rem] space-y-3 border-t-4 border-l-4 border-yellow-400 bg-white p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="bg-yellow-400 w-fit p-2 rounded-md">
        <Image src={icon} width={40} height={40} alt={title} />
      </div>
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
