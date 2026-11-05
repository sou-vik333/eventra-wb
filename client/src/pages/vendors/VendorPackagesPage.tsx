import { useEffect, useState } from "react";
import axios from "axios";

import {
  createPackage,
  deletePackage,
  getMyPackages,
  updatePackage,
  type PackageServiceInput,
} from "../../services/package.service";

import { getMyServices } from "../../services/service.service";

type Service = {
  id: number;
  name: string;
  description: string | null;
  basePrice: string | number;
  isActive: boolean;
};

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

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const responseData: unknown = error.response?.data;

    if (
      typeof responseData === "object" &&
      responseData !== null &&
      "message" in responseData &&
      typeof responseData.message === "string"
    ) {
      return responseData.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred. Please try again.";
}

function VendorPackagesPage() {
  const [packages, setPackages] = useState<VendorPackage[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPackageId, setEditingPackageId] =
    useState<number | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [selectedServices, setSelectedServices] =
    useState<PackageServiceInput[]>([]);

  function resetForm() {
    setName("");
    setDescription("");
    setPrice("");
    setSelectedServices([]);
    setEditingPackageId(null);
  }

  function openCreateForm() {
    resetForm();
    setError("");
    setSuccess("");
    setIsFormOpen(true);
  }

  function openEditForm(item: VendorPackage) {
    setName(item.package.name);
    setDescription(item.package.description ?? "");
    setPrice(String(item.package.price));
    setSelectedServices(
      item.services.map((service) => ({
        serviceId: service.serviceId,
        quantity: service.quantity,
      })),
    );
    setEditingPackageId(item.package.id);
    setError("");
    setSuccess("");
    setIsFormOpen(true);
  }

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [packagesResponse, servicesResponse] =
        await Promise.all([
          getMyPackages(),
          getMyServices(),
        ]);

      const packageData =
        packagesResponse?.data?.packages ??
        packagesResponse?.packages ??
        [];

      const serviceData =
        servicesResponse?.data?.services ??
        servicesResponse?.services ??
        [];

      setPackages(
        Array.isArray(packageData) ? packageData : [],
      );

      setServices(
        Array.isArray(serviceData) ? serviceData : [],
      );
    } catch (err: unknown) {
      console.error("Failed to load vendor packages:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadData();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  function toggleService(serviceId: number, checked: boolean) {
    setSelectedServices((current) => {
      if (checked) {
        if (
          current.some(
            (item) => item.serviceId === serviceId,
          )
        ) {
          return current;
        }

        return [
          ...current,
          { serviceId, quantity: 1 },
        ];
      }

      return current.filter(
        (item) => item.serviceId !== serviceId,
      );
    });
  }

  function changeQuantity(
    serviceId: number,
    quantity: number,
  ) {
    setSelectedServices((current) =>
      current.map((item) =>
        item.serviceId === serviceId
          ? { ...item, quantity }
          : item,
      ),
    );
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (name.trim().length < 2) {
      setError(
        "Package name must contain at least 2 characters.",
      );
      return;
    }

    const parsedPrice = Number(price);

    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setError(
        "Enter a valid package price greater than zero.",
      );
      return;
    }

    if (selectedServices.length === 0) {
      setError(
        "Select at least one service for this package.",
      );
      return;
    }

    if (
      selectedServices.some(
        (item) =>
          !Number.isInteger(item.quantity) ||
          item.quantity <= 0,
      )
    ) {
      setError(
        "Each service quantity must be a positive whole number.",
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: name.trim(),
        description: description.trim() || undefined,
        price: parsedPrice,
        services: selectedServices,
      };

      if (editingPackageId !== null) {
        await updatePackage(editingPackageId, payload);
        setSuccess("Package updated successfully.");
      } else {
        await createPackage(payload);
        setSuccess("Package created successfully.");
      }

      setIsFormOpen(false);
      resetForm();
      await loadData();
    } catch (err: unknown) {
      console.error("Failed to save package:", err);
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(item: VendorPackage) {
    setError("");
    setSuccess("");

    try {
      await updatePackage(item.package.id, {
        isActive: !item.package.isActive,
      });

      setSuccess(
        item.package.isActive
          ? "Package deactivated successfully."
          : "Package activated successfully.",
      );

      await loadData();
    } catch (err: unknown) {
      console.error("Failed to update package status:", err);
      setError(getErrorMessage(err));
    }
  }

  async function handleDelete(item: VendorPackage) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.package.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await deletePackage(item.package.id);

      setPackages((current) =>
        current.filter(
          (entry) =>
            entry.package.id !== item.package.id,
        ),
      );

      setSuccess("Package deleted successfully.");
    } catch (err: unknown) {
      console.error("Failed to delete package:", err);
      setError(getErrorMessage(err));
    }
  }

  function getServiceName(serviceId: number) {
    return (
      services.find((service) => service.id === serviceId)
        ?.name ?? `Service #${serviceId}`
    );
  }

  function closeForm() {
    if (saving) {
      return;
    }

    setIsFormOpen(false);
    resetForm();
    setError("");
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-purple-600">
            Vendor Dashboard
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            My Packages
          </h1>

          <p className="mt-2 text-slate-600">
            Combine your services into packages for customers.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="rounded-lg bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
        >
          Create Package
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="mt-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
        >
          {success}
        </div>
      )}

      {isFormOpen && (
        <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-slate-900">
              {editingPackageId !== null
                ? "Edit Package"
                : "Create New Package"}
            </h2>

            <button
              type="button"
              onClick={closeForm}
              disabled={saving}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-6 grid gap-5 md:grid-cols-2"
          >
            <div>
              <label
                htmlFor="package-name"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Package Name
              </label>

              <input
                id="package-name"
                type="text"
                required
                minLength={2}
                maxLength={150}
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="e.g. Premium Wedding Package"
                className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <div>
              <label
                htmlFor="package-price"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Package Price (₹)
              </label>

              <input
                id="package-price"
                type="number"
                required
                min="0.01"
                step="0.01"
                value={price}
                onChange={(event) =>
                  setPrice(event.target.value)
                }
                placeholder="25000"
                className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="package-description"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Description
              </label>

              <textarea
                id="package-description"
                rows={3}
                maxLength={1000}
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="Describe what's included in this package."
                className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <div className="md:col-span-2">
              <h3 className="text-base font-semibold text-slate-900">
                Included Services
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Select at least one active service and specify its quantity.
              </p>

              <div className="mt-4 space-y-3">
                {services.filter((service) => service.isActive)
                  .length === 0 ? (
                  <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
                    No active services available. Create or activate a
                    service before creating a package.
                  </p>
                ) : (
                  services
                    .filter((service) => service.isActive)
                    .map((service) => {
                      const selected = selectedServices.find(
                        (item) =>
                          item.serviceId === service.id,
                      );

                      return (
                        <div
                          key={service.id}
                          className="flex flex-col gap-3 rounded-lg border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <label className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={Boolean(selected)}
                              onChange={(event) =>
                                toggleService(
                                  service.id,
                                  event.target.checked,
                                )
                              }
                              className="mt-1 h-4 w-4 accent-purple-600"
                            />

                            <span>
                              <span className="block font-medium text-slate-900">
                                {service.name}
                              </span>

                              <span className="mt-1 block text-sm text-slate-500">
                                Starting price:{" "}
                                {formatPrice(service.basePrice)}
                              </span>
                            </span>
                          </label>

                          {selected && (
                            <div className="flex items-center gap-3">
                              <label
                                htmlFor={`quantity-${service.id}`}
                                className="text-sm text-slate-600"
                              >
                                Quantity
                              </label>

                              <input
                                id={`quantity-${service.id}`}
                                type="number"
                                min="1"
                                step="1"
                                required
                                value={selected.quantity}
                                onChange={(event) =>
                                  changeQuantity(
                                    service.id,
                                    Number(event.target.value),
                                  )
                                }
                                className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 md:col-span-2">
              <button
                type="submit"
                disabled={
                  saving ||
                  services.filter(
                    (service) => service.isActive,
                  ).length === 0
                }
                className="rounded-lg bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingPackageId !== null
                    ? "Update Package"
                    : "Create Package"}
              </button>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="mt-8">
        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
            Loading packages...
          </div>
        ) : packages.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              No packages yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Create your first package by combining your active services.
            </p>

            <button
              type="button"
              onClick={openCreateForm}
              className="mt-5 rounded-lg bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
            >
              Create Your First Package
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {packages.map((item) => (
              <article
                key={item.package.id}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-purple-600">
                      Package #{item.package.id}
                    </p>

                    <h2 className="mt-1 text-xl font-semibold text-slate-900">
                      {item.package.name}
                    </h2>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      item.package.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {item.package.isActive ? "ACTIVE" : "INACTIVE"}
                  </span>
                </div>

                <p className="mt-4 min-h-10 text-sm leading-6 text-slate-600">
                  {item.package.description ||
                    "No description provided."}
                </p>

                <div className="mt-5 rounded-lg bg-purple-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-purple-700">
                    Package Price
                  </p>

                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {formatPrice(item.package.price)}
                  </p>
                </div>

                <div className="mt-5">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Included Services ({item.services.length})
                  </h3>

                  {item.services.length === 0 ? (
                    <p className="mt-2 text-sm text-slate-500">
                      No services included.
                    </p>
                  ) : (
                    <ul className="mt-3 space-y-2">
                      {item.services.map((service) => (
                        <li
                          key={`${service.packageId}-${service.serviceId}`}
                          className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2 text-sm"
                        >
                          <span className="text-slate-700">
                            {getServiceName(service.serviceId)}
                          </span>

                          <span className="shrink-0 font-medium text-slate-900">
                            Qty: {service.quantity}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => openEditForm(item)}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => void handleToggleActive(item)}
                    className="rounded-lg border border-purple-200 px-4 py-2 text-sm font-medium text-purple-700 transition hover:bg-purple-50"
                  >
                    {item.package.isActive
                      ? "Deactivate"
                      : "Activate"}
                  </button>

                  <button
                    type="button"
                    onClick={() => void handleDelete(item)}
                    className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default VendorPackagesPage;