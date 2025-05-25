import { z } from "zod";

const signUpSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be atleast of 6 characters"),
  name: z.string().min(3, "Username must be of atleast 3 characters"),
});

export default signUpSchema;
