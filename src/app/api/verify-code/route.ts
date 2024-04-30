import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

//Request fetch data from api
export async function POST(request: Request) {
  await dbConnect();

  try {
    //username, code value come from url
    const { username, code } = await request.json();
    console.log("username:", username, "code:", code);

    //taken value from url its decode value in original form
    const decodedUsername = decodeURIComponent(username);

    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: " User not found",
        },
        { status: 500 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const iscodeNotExpired = new Date(user.verifycodeExpire) > new Date();

    console.log("isCodevalid :", isCodeValid);

    if (isCodeValid && iscodeNotExpired) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        {
          success: true,
          message: " Account Verified Success",
        },
        { status: 200 }
      );
    } else if (!iscodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: "verification code Expire",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "verification code incorrect",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error(" Error Verifying User :", error);
    return Response.json(
      {
        success: false,
        message: " Error Verifying User",
      },
      { status: 500 }
    );
  }
}
