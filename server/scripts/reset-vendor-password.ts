import bcrypt from "bcryptjs";
import { db } from "../src/prisma/db.js";

const email = "testvendor@example.com";
const newPassword = "Vendor@123456";

const user = await db.orm.public.User.first({ email });

if (!user) {
  console.log("Vendor test user not found.");
  await db.close();
  process.exit(1);
}

const passwordHash = await bcrypt.hash(newPassword, 12);

await db.orm.public.User.where({ id: user.id }).update({
  passwordHash,
  role: "VENDOR",
  isActive: true,
});

console.log("Vendor password reset successfully.");
console.log({
  email,
  newPassword,
  role: "VENDOR",
});

await db.close();