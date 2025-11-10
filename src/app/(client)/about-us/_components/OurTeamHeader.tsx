import React from "react";

export default function OurTeamHeader() {
  return (
    <div className="container mx-auto px-4 max-w-3xl text-center">
      <div className="flex items-center justify-center mb-4">
        <div className="flex-grow border-t-2 border-black mx-4 sm:mx-8"></div>
        <h2 className="text-4xl md:text-5xl font-extrabold leading-none px-4">
          Our Team
        </h2>
        <div className="flex-grow border-t-2 border-black mx-4 sm:mx-8"></div>
      </div>
      <p className="text-base sm:text-lg text-gray-600">
        Staff members at Hostella
      </p>
    </div>
  );
}
