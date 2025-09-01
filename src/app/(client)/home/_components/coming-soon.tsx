import { Button } from "@/components/ui/button";
import { Mail, MapPin, Star } from "lucide-react";

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background accent gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-lime-50 via-white to-lime-100 opacity-60"></div>

        {/* Diagonal light streaks */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-lime-100 rotate-45 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-lime-200 -rotate-12 opacity-30 rounded-full blur-3xl"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          {/* Logo + Title */}
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="relative">
                <div className="w-16 h-16 bg-lime-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <div className="w-8 h-6 bg-white rounded-sm relative">
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-white"></div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-3 bg-lime-500 rounded-t-sm"></div>
                  </div>
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-slate-800">
                Hostella
              </h1>
            </div>

            <p className="text-xl md:text-2xl text-lime-600 font-medium">
              Your gateway to amazing hostel experiences
            </p>
          </div>

          {/* Coming soon text */}
          <div className="space-y-6">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-800 leading-tight">
              Coming soon
            </h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Discover and book unique hostels around you. Find your perfect
              stay for your next adventure.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid md:grid-cols-2 gap-8 my-16">
            <div className="bg-white p-8 rounded-3xl shadow-md border border-lime-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-14 h-14 bg-lime-100 rounded-2xl flex items-center justify-center">
                  <MapPin className="w-7 h-7 text-lime-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800">
                  Discover
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Find unique hostels with considerable pricing
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-md border border-lime-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-14 h-14 bg-lime-100 rounded-2xl flex items-center justify-center">
                  <Star className="w-7 h-7 text-lime-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800">Book</h3>
                <p className="text-slate-600 leading-relaxed">
                  Secure your stay with confidence using authentic reviews and
                  easy booking
                </p>
              </div>
            </div>
          </div>

          {/* Email CTA */}
          <div className="space-y-8">
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-lime-100 shadow-md">
              <p className="text-lg font-medium text-slate-700 mb-6">
                Be the first to know when we launch
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  size="lg"
                  className="bg-lime-500 cursor-pointer hover:bg-lime-600 text-white px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Get Early Access
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
