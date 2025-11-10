import React from "react";
import AboutUsStory from "./AboutUsStory/AboutUsStory";
import AboutMission from "./VisionMission/AboutMission";
import KeyMetrics from "./KeyMetrics/KeyMetrics";
import OurPeople from "./OurPeople/OurPeople";
import OurTeam from "./OurTeam/OurTeam";

export default function AboutUs() {
  return (
    <div>
      <AboutUsStory />
      <AboutMission />
      <OurPeople />
      <OurTeam />
      <KeyMetrics />
    </div>
  );
}
