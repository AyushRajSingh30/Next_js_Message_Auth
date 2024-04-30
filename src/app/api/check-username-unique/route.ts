import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    //localhost:3000/api/cheakusername.unique?username=ayush?phone=anroide
    const { searchParams } = new URL(request.url);
    const queryParams = {
      username: searchParams.get("username"),
    };

    //validation with zod
    //safepaese work is schema follow hua to apko value mil jaigi
    //safepase give two value success and data
    //safeParse want object argument

    const result = UsernameQuerySchema.safeParse(queryParams);

    //result give value (success, data);
    console.log("result :", result);

    // result.error.format() give push all error in array
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "Invalid query parameters",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;

    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    console.log(existingVerifiedUser);
    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 200 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username is unique",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking username:", error);
    return Response.json(
      {
        success: false,
        message: "Error checking username",
      },
      { status: 500 }
    );
  }
}
