import { Button } from "@/components/ui/button";
import { Mail, MapPin, Star } from "lucide-react";

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large organic shapes */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-green-100 rounded-full opacity-60"></div>
        <div className="absolute top-1/3 -left-32 w-64 h-64 bg-green-200 rounded-full opacity-40"></div>
        <div className="absolute bottom-20 right-1/4 w-48 h-48 bg-green-100 rounded-full opacity-50"></div>

        {/* Abstract house shapes */}
        <div
          className="absolute top-1/4 right-1/3 w-16 h-12 bg-green-200 opacity-30"
          style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
        ></div>
        <div
          className="absolute bottom-1/3 left-1/4 w-12 h-8 bg-green-300 opacity-40"
          style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
        ></div>

        {/* Decorative plant/leaf elements */}
        <div className="absolute bottom-32 left-16">
          <div className="w-8 h-16 bg-green-200 opacity-50 rounded-full transform rotate-12"></div>
          <div className="w-6 h-12 bg-green-300 opacity-40 rounded-full transform -rotate-12 -mt-8 ml-4"></div>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="relative">
                <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <div className="w-8 h-6 bg-white rounded-sm relative">
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-white"></div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-3 bg-green-500 rounded-t-sm"></div>
                  </div>
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-slate-800">
                Hostella
              </h1>
            </div>

            <p className="text-xl md:text-2xl text-green-600 font-medium text-balance">
              Your gateway to amazing hostel experiences
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-800 text-balance leading-tight">
              Coming soon
            </h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto text-pretty leading-relaxed">
              Discover and book unique hostels around you. Find your perfect
              stay for your next adventure.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 my-16">
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
                  <MapPin className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800">
                  Discover
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Find unique hostels with considerable pricing
                </p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
                  <Star className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800">Book</h3>
                <p className="text-slate-600 leading-relaxed">
                  Secure your stay with confidence using authentic reviews and
                  easy booking
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white/60 backdrop-blur-sm p-8 rounded-3xl border border-green-100 shadow-lg">
              <p className="text-lg font-medium text-slate-700 mb-6">
                Be the first to know when we launch
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  size="lg"
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
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
