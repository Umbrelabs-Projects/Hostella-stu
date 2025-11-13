import { StaticImageData } from "next/image";

export interface Booking {
  id: number;
  hostelId: number;
  roomId: number;
  status: string;
  roomNumber?: string;
  arrivalDate?: string;
  price?: string;
  hostelName?: string;
  hostelImage?: string | StaticImageData;
  roomTitle?: string;
}
