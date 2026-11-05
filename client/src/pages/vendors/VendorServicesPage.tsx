import { useEffect, useState } from "react";

import {
  createService,
  deleteService,
  getMyServices,
  updateService,
} from "../../services/service.service";

import { getServiceCategories } from "../../services/service-category.service";

type Service = {
  id: number;
  vendorId: number;
  categoryId: number;
  name: string;
  description: string | null;
  basePrice: string | number;
  durationMinutes: number | null;
  isActive: boolean;
};

type ServiceCategory = {
  id: number;
  name: string;
};

function VendorServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] =
    useState<number | null>(null);

  const [saving, setSaving] = useState(false);
  const [deletingServiceId, setDeletingServiceId] =
    useState<number | null>(null);
  const [updatingServiceId, setUpdatingServiceId] =
    useState<number | null>(null);

  const [categoryId, setCategoryId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");

  function getCategoryName(categoryId: number) {
    const category = categories.find(
      (item) => item.id === categoryId,
    );

    return category?.name || `Category #${categoryId}`;
  }

  function resetForm() {
    setCategoryId("");
    setName("");
    setDescription("");
    setBasePrice("");
    setDurationMinutes("");
    setEditingServiceId(null);
  }

  function openCreateForm() {
    resetForm();
    setError("");
    setSuccess("");
    setIsFormOpen(true);
  }

  function openEditForm(service: Service) {
    setCategoryId(String(service.categoryId));
    setName(service.name);
    setDescription(service.description || "");
    setBasePrice(String(service.basePrice));
    setDurationMinutes(
      service.durationMinutes
        ? String(service.durationMinutes)
        : "",
    );
    setEditingServiceId(service.id);
    setError("");
    setSuccess("");
    setIsFormOpen(true);
  }

  function closeForm() {
    if (saving) {
      return;
    }

    setIsFormOpen(false);
    resetForm();
  }

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [servicesResponse, categoriesResponse] =
        await Promise.all([
          getMyServices(),
          getServiceCategories(),
        ]);

      const serviceData =
        servicesResponse?.data?.services ??
        servicesResponse?.services ??
        servicesResponse;

      const categoryData =
        categoriesResponse?.data?.categories ??
        categoriesResponse?.categories ??
        categoriesResponse;

      setServices(
        Array.isArray(serviceData)
          ? serviceData
          : [],
      );

      setCategories(
        Array.isArray(categoryData)
          ? categoryData
          : [],
      );
    } catch (err) {
      console.error(
        "Failed to load vendor services:",
        err,
      );

      setError(
        "Unable to load your services. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadData();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const parsedCategoryId = Number(categoryId);
    const parsedBasePrice = Number(basePrice);
    const parsedDuration = durationMinutes
      ? Number(durationMinutes)
      : undefined;

    if (
      !Number.isInteger(parsedCategoryId) ||
      parsedCategoryId <= 0
    ) {
      setError("Please select a service category.");
      return;
    }

    if (name.trim().length < 2) {
      setError(
        "Service name must contain at least 2 characters.",
      );
      return;
    }

    if (
      !Number.isFinite(parsedBasePrice) ||
      parsedBasePrice <= 0
    ) {
      setError(
        "Base price must be greater than 0.",
      );
      return;
    }

    if (
      parsedDuration !== undefined &&
      (!Number.isInteger(parsedDuration) ||
        parsedDuration <= 0)
    ) {
      setError(
        "Duration must be a positive whole number.",
      );
      return;
    }

    try {
      setSaving(true);

      if (editingServiceId !== null) {
        await updateService(editingServiceId, {
          categoryId: parsedCategoryId,
          name: name.trim(),
          description: description.trim() || undefined,
          basePrice: parsedBasePrice,
          durationMinutes: parsedDuration,
        });

        setSuccess(
          "Service updated successfully.",
        );
      } else {
        await createService({
          categoryId: parsedCategoryId,
          name: name.trim(),
          description: description.trim() || undefined,
          basePrice: parsedBasePrice,
          durationMinutes: parsedDuration,
        });

        setSuccess(
          "Service created successfully.",
        );
      }

      setIsFormOpen(false);
      resetForm();

      await loadData();
    } catch (err) {
      console.error(
        "Failed to save service:",
        err,
      );

      setError(
        "Unable to save the service. Please check the details and try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(
    service: Service,
  ) {
    try {
      setError("");
      setSuccess("");
      setUpdatingServiceId(service.id);

      await updateService(service.id, {
        isActive: !service.isActive,
      });

      setSuccess(
        service.isActive
          ? "Service deactivated successfully."
          : "Service activated successfully.",
      );

      await loadData();
    } catch (err) {
      console.error(
        "Failed to update service status:",
        err,
      );

      setError(
        "Unable to update the service status. Please try again.",
      );
    } finally {
      setUpdatingServiceId(null);
    }
  }

  async function handleDelete(
    service: Service,
  ) {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${service.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");
      setDeletingServiceId(service.id);

      await deleteService(service.id);

      setSuccess(
        "Service deleted successfully.",
      );

      await loadData();
    } catch (err) {
      console.error(
        "Failed to delete service:",
        err,
      );

      setError(
        "Unable to delete the service. If it has booking history, consider deactivating it instead.",
      );
    } finally {
      setDeletingServiceId(null);
    }
  }

  function formatPrice(
    amount: string | number,
  ) {
    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount)) {
      return "₹0";
    }

    return `₹${numericAmount.toLocaleString(
      "en-IN",
    )}`;
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              My Services
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              Manage the services you offer to
              customers.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="rounded-lg bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
          >
            Add New Service
          </button>
        </div>

        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        {isFormOpen && (
          <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {editingServiceId !== null
                    ? "Edit Service"
                    : "Add New Service"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add accurate service information
                  customers can see.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
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
                  htmlFor="category"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Service Category
                </label>

                <select
                  id="category"
                  value={categoryId}
                  onChange={(event) =>
                    setCategoryId(event.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  required
                >
                  <option value="">
                    Select category
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="service-name"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Service Name
                </label>

                <input
                  id="service-name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="e.g. Wedding Photography"
                  className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value,
                    )
                  }
                  placeholder="Describe what is included in this service."
                  rows={4}
                  className="w-full resize-none rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />
              </div>

              <div>
                <label
                  htmlFor="base-price"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Base Price (₹)
                </label>

                <input
                  id="base-price"
                  type="number"
                  min="1"
                  step="0.01"
                  value={basePrice}
                  onChange={(event) =>
                    setBasePrice(event.target.value)
                  }
                  placeholder="25000"
                  className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="duration"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Duration (minutes)
                </label>

                <input
                  id="duration"
                  type="number"
                  min="1"
                  step="1"
                  value={durationMinutes}
                  onChange={(event) =>
                    setDurationMinutes(
                      event.target.value,
                    )
                  }
                  placeholder="480"
                  className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingServiceId !== null
                      ? "Update Service"
                      : "Create Service"}
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="mt-8">
          {loading ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
              Loading services...
            </div>
          ) : services.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">
                No services yet
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Add your first service to start
                receiving booking requests.
              </p>

              <button
                type="button"
                onClick={openCreateForm}
                className="mt-5 rounded-lg bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
              >
                Add New Service
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {services.map((service) => (
                <article
                  key={service.id}
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-purple-600">
                        {getCategoryName(
                          service.categoryId,
                        )}
                      </p>

                      <h2 className="mt-1 text-xl font-semibold text-slate-900">
                        {service.name}
                      </h2>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        service.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {service.isActive
                        ? "ACTIVE"
                        : "INACTIVE"}
                    </span>
                  </div>

                  <p className="mt-4 min-h-10 text-sm leading-6 text-slate-600">
                    {service.description ||
                      "No description provided."}
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-slate-50 p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Starting Price
                      </p>

                      <p className="mt-1 text-lg font-semibold text-slate-900">
                        {formatPrice(
                          service.basePrice,
                        )}
                      </p>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Duration
                      </p>

                      <p className="mt-1 text-lg font-semibold text-slate-900">
                        {service.durationMinutes
                          ? `${service.durationMinutes} min`
                          : "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        openEditForm(service)
                      }
                      className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleToggleActive(
                          service,
                        )
                      }
                      disabled={
                        updatingServiceId ===
                        service.id
                      }
                      className="rounded-lg border border-purple-200 px-4 py-2 text-sm font-medium text-purple-700 transition hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {updatingServiceId ===
                      service.id
                        ? "Updating..."
                        : service.isActive
                          ? "Deactivate"
                          : "Activate"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(service)
                      }
                      disabled={
                        deletingServiceId ===
                        service.id
                      }
                      className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingServiceId ===
                      service.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default VendorServicesPage;