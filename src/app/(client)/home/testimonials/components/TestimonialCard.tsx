import Image, { StaticImageData } from "next/image";
import React from "react";

interface Testimonial {
  id: number;
  name: string;
  image: string | StaticImageData;
  rating: number;
  text: string;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  const { name, image, rating, text } = testimonial;

  return (
    <div className="relative flex flex-col items-center text-center border-b-4 border-r-4 border-yellow-400 bg-white shadow-lg w-full max-w-[20rem] sm:max-w-[22rem] min-h-[22rem] px-8 py-10 mx-auto overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Avatar */}
      <div className="w-20 h-20 mb-4 rounded-full overflow-hidden border-2 border-[#FFB636]/40">
        <Image
          src={image}
          alt={name}
          width={80}
          height={80}
          className="object-cover w-full h-full"
        />
      </div>

      {/* Name */}
      <h3 className="text-gray-900 font-semibold text-lg tracking-tight">{name}</h3>

      {/* Rating */}
      <div className="flex justify-center mt-2 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`text-lg ${
              i < rating ? "text-[#FFB636]" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
      </div>

      {/* Testimonial Text */}
      <p className="text-gray-700 text-[0.95rem] leading-relaxed max-w-[16rem]">
        {text}
      </p>
    </div>
  );
};

export default TestimonialCard;
