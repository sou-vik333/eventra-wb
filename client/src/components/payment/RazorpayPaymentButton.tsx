import { useState } from "react";
import { useRazorpay } from "react-razorpay";

import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../../services/payment.service";

type RazorpayPaymentButtonProps = {
  paymentId: number;
  amount: number;
  name?: string;
  description?: string;
};

type RazorpaySuccessResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

function RazorpayPaymentButton({
  paymentId,
  amount,
  name = "Eventra WB",
  description = "Eventra WB Event Service Booking",
}: RazorpayPaymentButtonProps) {
  const { Razorpay } = useRazorpay();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handlePayment() {
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const orderResponse =
        await createRazorpayOrder(paymentId);

      const order = orderResponse?.data?.order;

      if (!order?.id) {
        throw new Error(
          "Razorpay order was not created",
        );
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name,
        description,
        order_id: order.id,

        handler: async (
          response: RazorpaySuccessResponse,
        ) => {
          try {
            setLoading(true);

            await verifyRazorpayPayment({
              paymentId,
              razorpayOrderId:
                response.razorpay_order_id,
              razorpayPaymentId:
                response.razorpay_payment_id,
              razorpaySignature:
                response.razorpay_signature,
            });

            setError("");

            setSuccess(
              "Payment successful and booking confirmed.",
            );
          } catch (verificationError) {
            if (
              verificationError instanceof Error
            ) {
              setError(
                verificationError.message,
              );
            } else {
              setError(
                "Payment verification failed",
              );
            }
          } finally {
            setLoading(false);
          }
        },

        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },

        theme: {
          color: "#7c3aed",
        },
      };

      const razorpay = new Razorpay(options);

      razorpay.on(
        "payment.failed",
        (response) => {
          setError(
            response.error?.description ||
              "Payment failed",
          );

          setLoading(false);
        },
      );

      razorpay.open();
    } catch (paymentError) {
      if (paymentError instanceof Error) {
        setError(paymentError.message);
      } else {
        setError(
          "Unable to start Razorpay payment",
        );
      }

      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handlePayment}
        disabled={loading}
        className="w-full rounded-lg bg-purple-600 px-5 py-3 font-medium text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? "Processing..."
          : `Pay ₹${amount.toLocaleString("en-IN")}`}
      </button>

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}

export default RazorpayPaymentButton;