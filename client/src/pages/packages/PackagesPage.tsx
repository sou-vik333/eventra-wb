
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import { getActivePackages } from "../../services/package.service";
import { getServiceById } from "../../services/service.service";

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

function formatPrice(price: string | number) {
  return `₹${Number(price).toLocaleString("en-IN")}`;
}

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data;

    if (
      responseData &&
      typeof responseData.message === "string"
    ) {
      return responseData.message;
    }
  }

  return "Unable to load packages. Please try again.";
}

function PackagesPage() {
  const [packages, setPackages] = useState<VendorPackage[]>([]);
  const [serviceNames, setServiceNames] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPackages() {
      try {
        setLoading(true);
        setError("");

        const response = await getActivePackages();

        const packageData =
          response?.data?.packages ??
          response?.packages ??
          [];

        const packageList: VendorPackage[] =
          Array.isArray(packageData) ? packageData : [];

        setPackages(packageList);

        const serviceIds = [
          ...new Set(
            packageList.flatMap((item) =>
              item.services.map((service) => service.serviceId),
            ),
          ),
        ];

        const serviceResults = await Promise.all(
          serviceIds.map(async (serviceId) => {
            try {
              const serviceResponse =
                await getServiceById(serviceId);

              return {
                id: serviceId,
                name:
                  serviceResponse?.data?.service?.name ??
                  `Service #${serviceId}`,
              };
            } catch {
              return {
                id: serviceId,
                name: `Service #${serviceId}`,
              };
            }
          }),
        );

        const names: Record<number, string> = {};

        serviceResults.forEach((service) => {
          names[service.id] = service.name;
        });

        setServiceNames(names);
      } catch (err: unknown) {
        console.error("Failed to load packages:", err);
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }

    void loadPackages();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-600">
            Eventra WB Packages
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Explore Event Packages
          </h1>

          <p className="mt-3 max-w-2xl text-gray-600">
            Discover event packages offered by vendors.
            Compare prices and explore the services included
            in each package.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
            <p className="text-gray-600">
              Loading packages...
            </p>
          </div>
        ) : packages.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              No packages available
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Vendors have not published any active packages yet.
              Please check again later.
            </p>

            <Link
              to="/services"
              className="mt-5 inline-block rounded-lg bg-purple-600 px-5 py-3 text-sm font-medium text-white hover:bg-purple-700"
            >
              Explore Individual Services
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {packages.map((item) => (
              <article
                key={item.package.id}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">
                  Event Package
                </p>

                <h2 className="mt-2 text-xl font-bold text-gray-900">
                  {item.package.name}
                </h2>

                <p className="mt-3 min-h-12 text-sm leading-6 text-gray-600">
                  {item.package.description ||
                    "No description provided."}
                </p>

                <div className="mt-5 rounded-xl bg-purple-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-purple-700">
                    Package Price
                  </p>

                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {formatPrice(item.package.price)}
                  </p>
                </div>

                <div className="mt-5">
                  <h3 className="font-semibold text-gray-900">
                    Included Services ({item.services.length})
                  </h3>

                  {item.services.length === 0 ? (
                    <p className="mt-2 text-sm text-gray-500">
                      No services listed.
                    </p>
                  ) : (
                    <ul className="mt-3 space-y-2">
                      {item.services.map((service) => (
                        <li
                          key={`${service.packageId}-${service.serviceId}`}
                          className="flex items-center justify-between gap-3 rounded-lg bg-gray-50 px-3 py-3 text-sm"
                        >
                          <span className="text-gray-700">
                            {serviceNames[service.serviceId] ??
                              `Service #${service.serviceId}`}
                          </span>

                          <span className="shrink-0 font-medium text-gray-900">
                            Qty: {service.quantity}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <Link
                  to={`/vendors/${item.package.vendorId}`}
                  state={{ from: "/packages" }}
                  className="mt-6 inline-block w-full rounded-lg border border-purple-200 px-4 py-3 text-center text-sm font-semibold text-purple-700 transition hover:bg-purple-50"
                >
                  View Vendor
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default PackagesPage;
