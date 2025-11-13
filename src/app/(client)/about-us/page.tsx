import React from "react";
import AboutUsStory from "./AboutUsStory/AboutUsStory";
import AboutMission from "./VisionMission/AboutMission";
import KeyMetrics from "./KeyMetrics/KeyMetrics";
import OurPeople from "./OurPeople/OurPeople";
import OurTeam from "./OurTeam/OurTeam";
import AboutUsHero from "./_components/AboutUsHero";
import Image from "next/image";
import { images } from "@/lib/images";
import OurPeopleImg from "./_components/OurPeopleImg";

export default function AboutUs() {
  return (
    <div className="">
      {/* <AboutUsHero /> */}
      <AboutUsStory />
      <AboutMission />
      <KeyMetrics />
      {/* <OurPeopleImg /> */}
      <OurPeople />
      <OurTeam />
    </div>
  );
}
