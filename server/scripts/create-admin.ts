import bcrypt from "bcryptjs";
import { db } from "../src/prisma/db.js";

const email = "testadmin@example.com";
const username = "testadmin01";
const name = "Test Admin";
const password = "Admin@123456";

const existingUser = await db.orm.public.User.first({ email });

if (existingUser) {
  console.log("Admin test user already exists.");
  await db.close();
  process.exit(0);
}

const passwordHash = await bcrypt.hash(password, 12);

const user = await db.orm.public.User.create({
  email,
  username,
  name,
  passwordHash,
  role: "ADMIN",
  isActive: true,
});

console.log("Admin test user created successfully.");
console.log({
  id: user.id,
  email: user.email,
  username: user.username,
  role: user.role,
});

await db.close();