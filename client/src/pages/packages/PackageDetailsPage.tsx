
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { getPackageById } from "../../services/package.service";
import { getServiceById } from "../../services/service.service";
import { getVendorById } from "../../services/vendor.service";

type PackageRecord = {
  id: number;
  vendorId: number;
  name: string;
  description: string | null;
  price: string | number;
  isActive: boolean;
};

type PackageServiceRecord = {
  packageId: number;
  serviceId: number;
  quantity: number;
};

type VendorPackage = {
  package: PackageRecord;
  services: PackageServiceRecord[];
};

type Vendor = {
  id: number;
  businessName: string;
  description?: string | null;
  phone?: string | null;
  email?: string | null;
  isVerified: boolean;
  status: string;
};

function formatPrice(price: string | number) {
  return `₹${Number(price).toLocaleString("en-IN")}`;
}

function PackageDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const packageId = Number(id);

  const [packageData, setPackageData] =
    useState<VendorPackage | null>(null);

  const [serviceNames, setServiceNames] =
    useState<Record<number, string>>({});

  const [vendor, setVendor] = useState<Vendor | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!Number.isInteger(packageId) || packageId <= 0) {
      return;
    }

    async function loadPackageDetails() {
      try {
        const response = await getPackageById(packageId);

        const data: VendorPackage | null =
          response?.data?.package
            ? response.data
            : null;

        if (!data?.package?.isActive) {
          setPackageData(null);
          setError("Package not found or no longer available.");
          setLoading(false);
          return;
        }

        setPackageData(data);

        const [vendorResponse, ...serviceResults] =
          await Promise.all([
            getVendorById(data.package.vendorId),
            ...data.services.map(async (service) => {
              try {
                const serviceResponse =
                  await getServiceById(service.serviceId);

                return {
                  id: service.serviceId,
                  name:
                    serviceResponse?.data?.service?.name ??
                    `Service #${service.serviceId}`,
                };
              } catch {
                return {
                  id: service.serviceId,
                  name: `Service #${service.serviceId}`,
                };
              }
            }),
          ]);

        setVendor(
          vendorResponse?.data?.vendor ?? null,
        );

        const names: Record<number, string> = {};

        serviceResults.forEach((service) => {
          names[service.id] = service.name;
        });

        setServiceNames(names);
      } catch (err) {
        console.error("Failed to load package details:", err);

        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message ??
              "Unable to load package details.",
          );
        } else {
          setError("Unable to load package details.");
        }
      } finally {
        setLoading(false);
      }
    }

    void loadPackageDetails();
  }, [packageId]);

  if (!Number.isInteger(packageId) || packageId <= 0) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-5xl rounded-xl border bg-white p-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Invalid Package ID
          </h1>

          <Link
            to="/packages"
            className="mt-6 inline-block rounded-lg bg-purple-600 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-700"
          >
            Back to Packages
          </Link>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-5xl rounded-xl border bg-white p-8 text-center">
          <p className="text-gray-600">
            Loading package details...
          </p>
        </div>
      </main>
    );
  }

  if (error || !packageData) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-5xl rounded-xl border bg-white p-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Package Unavailable
          </h1>

          <p className="mt-3 text-gray-600">
            {error || "This package could not be found."}
          </p>

          <Link
            to="/packages"
            className="mt-6 inline-block rounded-lg bg-purple-600 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-700"
          >
            Back to Packages
          </Link>
        </div>
      </main>
    );
  }

  const currentPackage = packageData.package;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/packages"
          className="text-sm font-medium text-purple-700 hover:underline"
        >
          ← Back to Packages
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-3">
          <section className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">
                Event Package
              </p>

              <h1 className="mt-3 text-3xl font-bold text-gray-900">
                {currentPackage.name}
              </h1>

              <p className="mt-4 whitespace-pre-wrap leading-7 text-gray-600">
                {currentPackage.description ||
                  "No description provided."}
              </p>

              <div className="mt-6 rounded-xl bg-purple-50 p-5">
                <p className="text-sm font-medium text-purple-700">
                  Package Price
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {formatPrice(currentPackage.price)}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">
                Included Services ({packageData.services.length})
              </h2>

              {packageData.services.length === 0 ? (
                <p className="mt-4 text-gray-500">
                  No services listed in this package.
                </p>
              ) : (
                <div className="mt-5 space-y-3">
                  {packageData.services.map((service) => (
                    <div
                      key={`${service.packageId}-${service.serviceId}`}
                      className="flex items-center justify-between gap-4 rounded-lg bg-gray-50 p-4"
                    >
                      <span className="font-medium text-gray-800">
                        {serviceNames[service.serviceId] ??
                          `Service #${service.serviceId}`}
                      </span>

                      <span className="shrink-0 text-sm font-semibold text-gray-700">
                        Qty: {service.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">
                Package Vendor
              </h2>

              {vendor ? (
                <>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">
                    {vendor.businessName}
                  </h3>

                  {vendor.isVerified && (
                    <span className="mt-2 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                      Verified
                    </span>
                  )}

                  {vendor.description && (
                    <p className="mt-3 text-sm leading-6 text-gray-600">
                      {vendor.description}
                    </p>
                  )}

                  <p className="mt-4 text-sm text-gray-600">
                    Status: {vendor.status}
                  </p>

                  <Link
                    to={`/vendors/${vendor.id}`}
                    state={{ from: `/packages/${packageId}` }}
                    className="mt-5 block rounded-lg border border-purple-200 px-4 py-3 text-center text-sm font-semibold text-purple-700 hover:bg-purple-50"
                  >
                    View Vendor Profile
                  </Link>
                </>
              ) : (
                <p className="mt-4 text-sm text-gray-500">
                  Vendor information is currently unavailable.
                </p>
              )}
            </div>

            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                Interested in this package?
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Contact the vendor to discuss your event requirements.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate(`/vendors/${currentPackage.vendorId}`)
                }
                className="mt-5 w-full rounded-lg bg-purple-600 px-4 py-3 text-sm font-semibold text-white hover:bg-purple-700"
              >
                Enquire About Package
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default PackageDetailsPage;
