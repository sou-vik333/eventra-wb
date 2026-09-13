import bcrypt from "bcryptjs";
import { db } from "../src/prisma/db.js";

const email = "testvendor2@example.com";
const username = "testvendor02";
const name = "Test Vendor 2";
const password = "Vendor2@123456";

const existingUser = await db.orm.public.User.first({ email });

if (existingUser) {
  console.log("Test vendor 2 already exists.");
  console.log({
    id: existingUser.id,
    email,
    password,
    role: existingUser.role,
  });

  await db.close();
  process.exit(0);
}

const passwordHash = await bcrypt.hash(password, 12);

const user = await db.orm.public.User.create({
  email,
  username,
  name,
  passwordHash,
  role: "VENDOR",
  isActive: true,
});

console.log("Test vendor 2 created successfully.");
console.log({
  id: user.id,
  email,
  password,
  role: user.role,
});

await db.close();