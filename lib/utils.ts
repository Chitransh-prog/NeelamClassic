import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SALON_INFO = {
  name: "Neelam Classic Salon and Academy",
  shortName: "Neelam Classic",
  owner: "Neelam Chourasiya",
  phone: "9826747023",
  telLink: "tel:+919826747023",
  formattedPhone: "+91 98267 47023",
  totalServicesCount: 135,
};

export function getWhatsAppUrl(message?: string): string {
  const defaultMsg = "Hi Neelam Classic Salon & Academy, I would like to enquire about your services and book an appointment.";
  const encoded = encodeURIComponent(message || defaultMsg);
  return `https://wa.me/919826747023?text=${encoded}`;
}
