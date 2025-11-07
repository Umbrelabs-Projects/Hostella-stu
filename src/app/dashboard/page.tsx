import ProtectedRoute from "@/components/protectedRoute/ProtectedRoute";
import { images } from "@/lib/images";
import Image from "next/image";
import React from "react";

export default function page() {
  return (
    <ProtectedRoute>
      <div>
        <Image src={images.dashboardImg} alt="profile" />
      </div>
    </ProtectedRoute>
  );
}
