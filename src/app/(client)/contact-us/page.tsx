"use client";

import { motion } from "framer-motion";
import ContactFormSection from "./_components/ContactFormSection";
import ContactInfoCard from "./_components/ContactInfoCard";
import Image from "next/image";
import { images } from "@/lib/images";

const ContactUs = () => {
  return (
    <section className="relative flex flex-col md:flex-row justify-center pt-20 items-start md:items-center py-16 px-6 md:px-[8%] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={images.room1}
          alt="Contact Background"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
        <div className="absolute inset-0 bg-black/20" /> {/* overlay */}
      </div>

      {/* Animated Info Card */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <ContactInfoCard />
      </motion.div>

      {/* Animated Form Section */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
       
        <ContactFormSection />
        
      </motion.div>
    </section>
  );
};

export default ContactUs;
