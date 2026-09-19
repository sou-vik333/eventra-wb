import {
  useEffect,
  useState,
} from "react";

import { getEventBookings } from "../../services/booking.service";
import { getPaymentByBookingId } from "../../services/payment.service";

import {
  getServiceById,
} from "../../services/service.service";

import {
  getVendorById,
} from "../../services/vendor.service";

type Booking = {
  id: number;
  eventId: number;
  vendorId: number;
  serviceId: number;
  totalAmount: number | string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

type Service = {
  id: number;
  name: string;
  description: string | null;
  basePrice: number | string;
  durationMinutes: number | null;
  vendorId: number;
};

type Vendor = {
  id: number;
  businessName: string;
  description: string | null;
  phone: string | null;
  email: string | null;
  isVerified: boolean;
  status: string;
};

type Payment = {
  id: number;
  bookingId: number;
  amount: number | string;
  method: string;
  status: string;
  razorpayOrderId: string | null;
  transactionId: string | null;
  paidAt: string | null;
};

type BookingSummaryProps = {
  eventId: number;
};

function BookingSummary({
  eventId,
}: BookingSummaryProps) {
  const [bookings, setBookings] =
    useState<Booking[]>([]);

  const [services, setServices] =
    useState<Record<number, Service>>({});

  const [vendors, setVendors] =
    useState<Record<number, Vendor>>({});

  const [payments, setPayments] =
    useState<Record<number, Payment>>({});

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadBookings() {
      try {
        setLoading(true);
        setError(null);

        const response =
          await getEventBookings(eventId);

        if (!active) {
          return;
        }

        const bookingList =
          response?.data?.bookings ?? [];

        setBookings(bookingList);

        const serviceResults =
          await Promise.all(
            bookingList.map(
              async (booking: Booking) => {
                try {
                  const serviceResponse =
                    await getServiceById(
                      booking.serviceId,
                    );

                  return {
                    id: booking.serviceId,
                    service:
                      serviceResponse?.data?.service ??
                      null,
                  };
                } catch {
                  return {
                    id: booking.serviceId,
                    service: null,
                  };
                }
              },
            ),
          );

        if (!active) {
          return;
        }

        const serviceMap: Record<
          number,
          Service
        > = {};

        serviceResults.forEach(
          (result) => {
            if (result.service) {
              serviceMap[result.id] =
                result.service;
            }
          },
        );

        setServices(serviceMap);

        const vendorIds: number[] = [
          ...new Set<number>(
            bookingList.map(
              (booking: Booking) =>
                booking.vendorId,
            ),
          ),
        ];

        const vendorResults =
          await Promise.all(
            vendorIds.map(
              async (vendorId) => {
                try {
                  const vendorResponse =
                    await getVendorById(
                      vendorId,
                    );

                  return {
                    id: vendorId,
                    vendor:
                      vendorResponse?.data?.vendor ??
                      null,
                  };
                } catch {
                  return {
                    id: vendorId,
                    vendor: null,
                  };
                }
              },
            ),
          );

        if (!active) {
          return;
        }

        const vendorMap: Record<
          number,
          Vendor
        > = {};

        vendorResults.forEach(
          (result) => {
            if (result.vendor) {
              vendorMap[result.id] =
                result.vendor;
            }
          },
        );

        setVendors(vendorMap);

        const paymentResults =
          await Promise.all(
            bookingList.map(
              async (booking: Booking) => {
                try {
                  const paymentResponse =
                    await getPaymentByBookingId(
                      booking.id,
                    );

                  return {
                    id: booking.id,
                    payment:
                      paymentResponse?.payment ??
                      null,
                  };
                } catch {
                  return {
                    id: booking.id,
                    payment: null,
                  };
                }
              },
            ),
          );

        if (!active) {
          return;
        }

        const paymentMap: Record<
          number,
          Payment
        > = {};

        paymentResults.forEach(
          (result) => {
            if (result.payment) {
              paymentMap[result.id] =
                result.payment;
            }
          },
        );

        setPayments(paymentMap);
      } catch {
        if (!active) {
          return;
        }

        setBookings([]);
        setServices({});
        setVendors({});
        setPayments({});
        setError(
          "Unable to load bookings",
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadBookings();

    return () => {
      active = false;
    };
  }, [eventId]);

  if (loading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Bookings
        </h2>

        <p className="mt-3 text-sm text-slate-500">
          Loading bookings...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Bookings
        </h2>

        <p className="mt-3 text-sm text-red-600">
          {error}
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Bookings
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Services booked for this event
          </p>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
          {bookings.length}
        </span>
      </div>

      {bookings.length === 0 ? (
        <div className="mt-5 rounded-xl border border-dashed border-slate-300 p-6 text-center">
          <p className="text-sm font-medium text-slate-700">
            No bookings yet
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Your booked services will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {bookings.map((booking) => {
            const service =
              services[booking.serviceId];

            const vendor =
              vendors[booking.vendorId];

            const payment =
              payments[booking.id];

            return (
              <div
                key={booking.id}
                className="rounded-xl border border-slate-200 p-4"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-slate-900">
                      Booking #{booking.id}
                    </p>

                    <p className="mt-1 text-base font-semibold text-gray-900">
                      {service
                        ? service.name
                        : `Service #${booking.serviceId}`}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {vendor
                        ? vendor.businessName
                        : `Vendor #${booking.vendorId}`}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="font-semibold text-slate-900">
                      ₹
                      {Number(
                        booking.totalAmount,
                      ).toLocaleString("en-IN")}
                    </p>

                    <span className="mt-1 inline-block rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                      {booking.status}
                    </span>
                  </div>
                </div>

                {payment && (
                  <div className="mt-4 border-t border-slate-100 pt-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-700">
                          Payment
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {payment.method}
                        </p>
                      </div>

                      <span className="inline-block w-fit rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                        {payment.status}
                      </span>
                    </div>

                    {payment.paidAt && (
                      <p className="mt-2 text-xs text-slate-500">
                        Paid on{" "}
                        {new Date(
                          payment.paidAt,
                        ).toLocaleString("en-IN")}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default BookingSummary;