import React from "react";
import OurTeamHeader from "../_components/OurTeamHeader";
import TeamCard from "../_components/TeamCard";
import { images } from "@/lib/images";

export default function OurTeam() {
  const teams = [
    {
      id: 1,
      name: "John Doe",
      image: images.johnDoe,
      text: "CEO",
    },
    {
      id: 2,
      name: "Esther Adams",
      image: images.esther,
      text: "Desk Manager",
    },
    {
      id: 3,
      name: "Paul Smith",
      image: images.paul,
      text: "Project Manager",
    },
  ];
  return (
    <div className="w-full py-12 md:py-16 font-sans bg-white">
      <OurTeamHeader />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mx-20">
        {teams.map((team) => (
          <div key={team.id} className="">
            <TeamCard team={team} />
          </div>
        ))}
      </div>
    </div>
  );
}
