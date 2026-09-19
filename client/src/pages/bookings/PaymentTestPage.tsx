import RazorpayPaymentButton from "../../components/payment/RazorpayPaymentButton";

function PaymentTestPage() {
  return (
    <div className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-md">
        <div className="rounded-2xl border bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold">
            Eventra WB Payment Test
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Razorpay Test Mode
          </p>

          <div className="my-6 border-t" />

          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Booking ID
            </p>

            <p className="font-semibold">
              #10
            </p>

            <p className="mt-4 text-sm text-gray-600">
              Payment ID
            </p>

            <p className="font-semibold">
              #3
            </p>

            <p className="mt-4 text-sm text-gray-600">
              Amount
            </p>

            <p className="text-2xl font-bold">
              ₹25,000
            </p>
          </div>

          <div className="mt-8">
            <RazorpayPaymentButton
              paymentId={3}
              amount={25000}
              name="Eventra WB"
              description="Eventra WB Test Booking #10"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentTestPage;