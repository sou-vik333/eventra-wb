import bcrypt from "bcryptjs";
import { db } from "../src/prisma/db.js";

const email = "testcustomer@example.com";
const username = "testcustomer01";
const name = "Test Customer";
const password = "Customer@123456";

const existingUser = await db.orm.public.User.first({ email });

if (existingUser) {
  console.log("Test customer already exists.");
  console.log({
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
  role: "CUSTOMER",
  isActive: true,
});

console.log("Test customer created successfully.");
console.log({
  id: user.id,
  email,
  password,
  role: user.role,
});

await db.close();