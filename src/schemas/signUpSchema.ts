import { z } from "zod";

//zod used for cheak validation like we apply some validation at my place zod apply it custome function validation.

//we not used z.objext() in usernameValidation because this is not a object this is singe element.
export const usernameValidation = z
  .string()
  .min(2, "Username must be at least 2 characters")
  .max(20, "Username must be more than 20 characters")
  .regex(
    /^[a-zA-Z0-9 ]+$/,
    "Username  not contain special characters otherthan this"
  );

  //here we used z.object() beacuse hear we apply validation on object
export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "invalide email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});
