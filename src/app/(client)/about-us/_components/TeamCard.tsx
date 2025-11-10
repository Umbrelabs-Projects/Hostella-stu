import Image, { StaticImageData } from "next/image";
import React from "react";

interface Team {
  id: number;
  name: string;
  image: string | StaticImageData;
  text: string;
}

interface TeamCardProps {
  team: Team;
}

const TeamCard: React.FC<TeamCardProps> = ({ team }) => {
  const { name, image, text } = team;

  return (
    <div className="relative flex flex-col items-center justify-between text-center border-b-4 border-r-4 border-yellow-400 bg-white shadow-xl w-full max-w-[18rem] min-h-[20rem] px-8 py-10 mx-auto overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Avatar */}
      <div className="w-[10rem] h-[10rem] mb-4 rounded-full overflow-hidden border-2 border-[#FFB636]/40">
        <Image
          src={image}
          alt={name}
          width={120}
          height={120}
          className="object-cover w-full h-full"
        />
      </div>

      <div>
        {/* Name */}
        <h3 className="text-gray-900 font-semibold text-lg tracking-tight">
          {name}
        </h3>

        {/* Team Text */}
        <p className="text-gray-700 text-[0.95rem] leading-relaxed max-w-[10rem]">
          {text}
        </p>
      </div>
    </div>
  );
};

export default TeamCard;
