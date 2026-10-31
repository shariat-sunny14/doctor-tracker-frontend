import { z } from "zod";
import { CONDITIONS, GENDERS } from "./constants";

const phone = z
  .string()
  .trim()
  .regex(/^\+?[0-9\s\-()]{7,18}$/, "Enter a valid phone number, e.g. 01712345678");

const email = z.string().trim().email("Enter a valid email address");

export const loginSchema = z.object({
  email: email,
  password: z.string().min(1, "Enter your password"),
});

export const doctorSchema = z.object({
  name: z.string().trim().min(2, "Enter the doctor's full name").max(100),
  specialization: z.string().trim().min(2, "Enter a specialization").max(80),
  hospital: z.string().trim().min(2, "Enter a hospital").max(120),
  phone,
  email,
});

export const patientSchema = z.object({
  name: z.string().trim().min(2, "Enter the patient's full name").max(100),
  age: z.preprocess(
    (value) => (value === "" || value == null ? undefined : value),
    z.coerce
      .number({ required_error: "Enter an age", invalid_type_error: "Enter an age" })
      .int("Age must be a whole number")
      .min(0, "Age cannot be negative")
      .max(130, "Enter a realistic age")
  ),
  gender: z.enum(
    GENDERS.map((g) => g.value),
    { errorMap: () => ({ message: "Select a gender" }) }
  ),
  phone,
  email: z.union([z.literal(""), email]),
  address: z.string().trim().max(200),
  condition: z.enum(CONDITIONS.map((c) => c.value)),
  doctorId: z.string().min(1, "Select a doctor"),
});
