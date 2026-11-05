import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { getServiceCategories } from "../../services/service-category.service";
import { getServicesByCategory } from "../../services/service.service";
import { getVendorById } from "../../services/vendor.service";

type ServiceCategory = {
  id: number;
  name: string;
  description?: string | null;
  isActive: boolean;
};

type Service = {
  id: number;
  name: string;
  description?: string | null;
  basePrice: string | number;
  durationMinutes?: number | null;
  vendorId: number;
  categoryId: number;
  isActive: boolean;
};

type Vendor = {
  id: number;
  businessName: string;
  description?: string | null;
  email?: string | null;
  phone?: string | null;
  isVerified: boolean;
  status: string;
};

type ServiceWithVendor = {
  service: Service;
  vendor: Vendor | null;
};

function ServicesPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const eventId = searchParams.get("eventId");

  const [categories, setCategories] = useState<
    ServiceCategory[]
  >([]);

  const [selectedCategoryId, setSelectedCategoryId] =
    useState<number | null>(null);

  const [services, setServices] = useState<
    ServiceWithVendor[]
  >([]);

  const [loadingCategories, setLoadingCategories] =
    useState(true);

  const [loadingServices, setLoadingServices] =
    useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCategories() {
      try {
        setLoadingCategories(true);
        setError("");

        const response =
          await getServiceCategories();

        const loadedCategories =
          response?.data?.categories ?? [];

        setCategories(loadedCategories);

        if (loadedCategories.length > 0) {
          setSelectedCategoryId(
            loadedCategories[0].id,
          );
        }
      } catch (categoryError) {
        if (categoryError instanceof Error) {
          setError(categoryError.message);
        } else {
          setError(
            "Failed to load service categories",
          );
        }
      } finally {
        setLoadingCategories(false);
      }
    }

    void loadCategories();
  }, []);

  useEffect(() => {
    async function loadServices() {
      if (!selectedCategoryId) {
        setServices([]);
        return;
      }

      try {
        setLoadingServices(true);
        setError("");

        const response =
          await getServicesByCategory(
            selectedCategoryId,
          );

        const loadedServices =
          response?.data?.services ?? [];

        const servicesWithVendors =
          await Promise.all(
            loadedServices.map(
              async (service: Service) => {
                try {
                  const vendorResponse =
                    await getVendorById(
                      service.vendorId,
                    );

                  return {
                    service,
                    vendor:
                      vendorResponse?.data?.vendor ??
                      null,
                  };
                } catch {
                  return {
                    service,
                    vendor: null,
                  };
                }
              },
            ),
          );

        setServices(servicesWithVendors);
      } catch (serviceError) {
        if (serviceError instanceof Error) {
          setError(serviceError.message);
        } else {
          setError(
            "Failed to load services",
          );
        }

        setServices([]);
      } finally {
        setLoadingServices(false);
      }
    }

    void loadServices();
  }, [selectedCategoryId]);

  function formatPrice(
    basePrice: string | number,
  ) {
    const numericPrice = Number(basePrice);

    if (
      !Number.isFinite(numericPrice) ||
      numericPrice <= 0
    ) {
      return "Price unavailable";
    }

    return `₹${numericPrice.toLocaleString(
      "en-IN",
    )}`;
  }

  function formatDuration(
    durationMinutes?: number | null,
  ) {
    if (!durationMinutes) {
      return "Duration not specified";
    }

    const hours = Math.floor(
      durationMinutes / 60,
    );

    const minutes = durationMinutes % 60;

    if (hours > 0 && minutes > 0) {
      return `${hours} hr ${minutes} min`;
    }

    if (hours > 0) {
      return `${hours} hr`;
    }

    return `${minutes} min`;
  }

  function handleBookService(
    service: Service,
  ) {
    if (!eventId) {
      return;
    }

    navigate(
      `/bookings/create?eventId=${eventId}&serviceId=${service.id}&vendorId=${service.vendorId}`,
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-wide text-purple-600">
            Eventra WB Services
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Find Services
          </h1>

          <p className="mt-3 max-w-2xl text-gray-600">
            Discover event services and compare
            available vendors for your event.
          </p>

          {eventId && (
            <p className="mt-2 text-sm text-gray-500">
              Selecting services for Event #{eventId}
            </p>
          )}
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mb-8 rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">
            Service Categories
          </h2>

          {loadingCategories ? (
            <p className="mt-4 text-sm text-gray-500">
              Loading categories...
            </p>
          ) : categories.length === 0 ? (
            <p className="mt-4 text-sm text-gray-500">
              No service categories are available.
            </p>
          ) : (
            <div className="mt-4 flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() =>
                    setSelectedCategoryId(
                      category.id,
                    )
                  }
                  className={`rounded-lg px-5 py-2.5 text-sm font-medium transition ${
                    selectedCategoryId ===
                    category.id
                      ? "bg-purple-600 text-white"
                      : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Available Services
              </h2>

              {selectedCategoryId && (
                <p className="mt-1 text-sm text-gray-500">
                  {
                    categories.find(
                      (category) =>
                        category.id ===
                        selectedCategoryId,
                    )?.name
                  }
                </p>
              )}
            </div>
          </div>

          {loadingServices ? (
            <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
              <p className="text-gray-600">
                Loading services...
              </p>
            </div>
          ) : services.length === 0 ? (
            <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
              <p className="font-medium text-gray-900">
                No services available
              </p>

              <p className="mt-2 text-sm text-gray-500">
                There are currently no active
                services in this category.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {services.map(
                ({ service, vendor }) => (
                  <div
                    key={service.id}
                    className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {service.name}
                        </h3>

                        {vendor && (
                          <p className="mt-1 text-sm text-purple-600">
                            {vendor.businessName}
                          </p>
                        )}
                      </div>

                      {vendor?.isVerified && (
                        <span className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                          Verified
                        </span>
                      )}
                    </div>

                    {service.description && (
                      <p className="mt-4 text-sm leading-6 text-gray-600">
                        {service.description}
                      </p>
                    )}

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-gray-50 p-4">
                        <p className="text-xs text-gray-500">
                          Price
                        </p>

                        <p className="mt-1 font-bold text-gray-900">
                          {formatPrice(
                            service.basePrice,
                          )}
                        </p>
                      </div>

                      <div className="rounded-lg bg-gray-50 p-4">
                        <p className="text-xs text-gray-500">
                          Duration
                        </p>

                        <p className="mt-1 font-bold text-gray-900">
                          {formatDuration(
                            service.durationMinutes,
                          )}
                        </p>
                      </div>
                    </div>

                    {vendor && (
                      <div className="mt-5 border-t pt-5">
                        <p className="text-sm font-medium text-gray-900">
                          Vendor
                        </p>

                        <p className="mt-1 text-sm text-gray-600">
                          {vendor.businessName}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          Status:{" "}
                          {vendor.status}
                        </p>

                        <Link
                          to={`/vendors/${service.vendorId}`}
                          className="mt-3 inline-block text-sm font-medium text-blue-600 hover:underline"
                        >
                          View Vendor
                        </Link>
                      </div>
                    )}

                    <button
                      type="button"
                      disabled={!eventId}
                      onClick={() =>
                        handleBookService(
                          service,
                        )
                      }
                      className="mt-6 w-full rounded-lg bg-purple-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {eventId
                        ? "Book Service"
                        : "Select an Event First"}
                    </button>
                  </div>
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ServicesPage;