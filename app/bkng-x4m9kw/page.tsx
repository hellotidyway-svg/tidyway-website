import type { Metadata } from 'next';
import Image from 'next/image';
import BookingForm from '@/components/booking/BookingForm';

export const metadata: Metadata = {
  title: 'Book Your Clean | TidyWay',
  robots: {
    index: false,
    follow: false,
  },
};

export default function HiddenBookingPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-start">
          <Image
            src="/TidyWay Logo Horizontal.png"
            alt="TidyWay"
            width={134}
            height={50}
            priority
          />
        </div>
      </div>

      <BookingForm />
    </main>
  );
}
