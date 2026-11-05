
import {
  addServiceToPackage,
  createPackage,
  deletePackage,
  findActivePackageById,
  findPackageById,
  getActivePackages,
  getPackageServices,
  getPackagesByVendorId,
  removeServiceFromPackage,
  updatePackage,
} from "../repositories/package.repository.js";

import {
  findServiceById,
} from "../repositories/service.repository.js";

import {
  findVendorByUserId,
} from "../repositories/vendor.repository.js";

import type {
  CreatePackageInput,
  UpdatePackageInput,
} from "../validators/package.validator.js";

async function findVendorForUser(userId: number) {
  const vendor = await findVendorByUserId(userId);

  if (!vendor) {
    throw new Error("Vendor profile not found");
  }

  return vendor;
}

async function validatePackageServices(
  vendorId: number,
  services: {
    serviceId: number;
    quantity: number;
  }[],
) {
  for (const packageService of services) {
    const service = await findServiceById(
      packageService.serviceId,
    );

    if (!service) {
      throw new Error(
        `Service ${packageService.serviceId} not found`,
      );
    }

    if (service.vendorId !== vendorId) {
      throw new Error(
        `Service ${packageService.serviceId} does not belong to this vendor`,
      );
    }

    if (!service.isActive) {
      throw new Error(
        `Service ${packageService.serviceId} is inactive`,
      );
    }
  }
}

export async function createVendorPackage(
  userId: number,
  data: CreatePackageInput,
) {
  const vendor = await findVendorForUser(userId);

  await validatePackageServices(
    vendor.id,
    data.services,
  );

  const packageRecord = await createPackage({
    vendorId: vendor.id,
    name: data.name,
    description: data.description ?? null,
    price: data.price,
    isActive: true,
  });

  for (const service of data.services) {
    await addServiceToPackage({
      packageId: packageRecord.id,
      serviceId: service.serviceId,
      quantity: service.quantity,
    });
  }

  return {
    package: packageRecord,
    services: await getPackageServices(
      packageRecord.id,
    ),
  };
}

export async function listVendorPackages(
  userId: number,
) {
  const vendor = await findVendorForUser(userId);

  const packages = await getPackagesByVendorId(
    vendor.id,
  );

  const packagesWithServices = await Promise.all(
    packages.map(async (packageRecord) => ({
      package: packageRecord,
      services: await getPackageServices(
        packageRecord.id,
      ),
    })),
  );

  return packagesWithServices;
}

export async function listActivePackages() {
  const packages = await getActivePackages();

  return Promise.all(
    packages.map(async (packageRecord) => ({
      package: packageRecord,
      services: await getPackageServices(
        packageRecord.id,
      ),
    })),
  );
}

export async function getPackage(
  packageId: number,
) {
  const packageRecord =
    await findActivePackageById(packageId);

  if (!packageRecord) {
    throw new Error("Package not found");
  }

  return {
    package: packageRecord,
    services: await getPackageServices(
      packageRecord.id,
    ),
  };
}

export async function updateVendorPackage(
  userId: number,
  packageId: number,
  data: UpdatePackageInput,
) {
  const vendor = await findVendorForUser(userId);

  const packageRecord =
    await findPackageById(packageId);

  if (!packageRecord) {
    throw new Error("Package not found");
  }

  if (packageRecord.vendorId !== vendor.id) {
    throw new Error(
      "You do not have permission to modify this package",
    );
  }

  if (data.services !== undefined) {
    await validatePackageServices(
      vendor.id,
      data.services,
    );

    const existingServices =
      await getPackageServices(packageId);

    for (const existingService of existingServices) {
      await removeServiceFromPackage(
        packageId,
        existingService.serviceId,
      );
    }

    for (const service of data.services) {
      await addServiceToPackage({
        packageId,
        serviceId: service.serviceId,
        quantity: service.quantity,
      });
    }
  }

  const updatedPackage =
    await updatePackage(packageId, {
      ...(data.name !== undefined && {
        name: data.name,
      }),
      ...(data.description !== undefined && {
        description: data.description,
      }),
      ...(data.price !== undefined && {
        price: data.price,
      }),
      ...(data.isActive !== undefined && {
        isActive: data.isActive,
      }),
    });

  return {
    package: updatedPackage,
    services: await getPackageServices(
      packageId,
    ),
  };
}

export async function deleteVendorPackage(
  userId: number,
  packageId: number,
) {
  const vendor = await findVendorForUser(userId);

  const packageRecord =
    await findPackageById(packageId);

  if (!packageRecord) {
    throw new Error("Package not found");
  }

  if (packageRecord.vendorId !== vendor.id) {
    throw new Error(
      "You do not have permission to delete this package",
    );
  }

  return deletePackage(packageId);
}
