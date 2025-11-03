import ContactFormSection from "./_components/ContactFormSection";
import ContactInfoCard from "./_components/ContactInfoCard";

const ContactUs = () => {
  return (
    <section className="flex flex-col md:flex-row justify-center mt-12 items-start md:items-center gap-12 md:gap-20 py-16 px-6 md:px-[8%] bg-white">
      <ContactInfoCard />
      <ContactFormSection />
    </section>
  );
};

export default ContactUs;
