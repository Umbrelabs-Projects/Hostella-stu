import { Phone, Mail, MapPin, Building2 } from "lucide-react";

const contactDetails = [
  {
    icon: <Phone className="w-6 h-6 text-white" />,
    title: "Call Us",
    content: (
      <>
        <p className="text-gray-700 text-sm">+233-504-425-267</p>
        <a
          href="tel:+233504425267"
          className="text-blue-600 hover:text-blue-700 text-sm underline"
        >
          +233-504-425-267
        </a>
      </>
    ),
  },
  {
    icon: <Mail className="w-6 h-6 text-white" />,
    title: "Email Us",
    content: (
      <a
        href="mailto:support@gmail.com"
        className="text-gray-700 text-sm hover:text-gray-900"
      >
        support@gmail.com
      </a>
    ),
  },
  {
    icon: <MapPin className="w-6 h-6 text-white" />,
    title: "Find Us",
    content: <p className="text-gray-700 text-sm">Kumasi</p>,
  },
  {
    icon: <Building2 className="w-6 h-6 text-white" />,
    title: "Registered Address",
    content: (
      <p className="text-gray-700 text-sm">
        AK-427-6732, Santasi, Ghana
      </p>
    ),
  },
];

const ContactInfoCard = () => {
  return (
    <div className="bg-yellow-400 p-6 md:p-8 rounded-xl shadow-sm w-full md:w-[22rem] space-y-6 border border-[#F4B400]/30">
      {contactDetails.map((item, i) => (
        <div
          key={i}
          className="flex items-start space-x-4 p-3 rounded-lg hover:bg-[#F5D98B]/30 transition-colors duration-200"
        >
          <div className="bg-[#F4B400]/10 p-3 rounded-lg flex items-center justify-center">
            {item.icon}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{item.title}</h4>
            <div className="mt-1">{item.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactInfoCard;
