/* If existingUserByEmail Exists Then
if existingUserByEmail.isVerified Then 
success:false,
Else
//save the update user
End if
Else
//create a new user with the provided details
//save the new user
End if*/

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    console.log(username, email, password);

    const existingUserVerified = await UserModel.findOne({
      username,
      isVerified: true,
    });

    console.log(existingUserVerified);
    if (existingUserVerified) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("existingUserByEmail :", existingUserByEmail);
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "Usr already exist with this email ",
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        (existingUserByEmail.password = hashedPassword),
          (existingUserByEmail.verifyCode = verifyCode);
        existingUserByEmail.verifycodeExpire = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifycodeExpire: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();
    }

    //send verification email

    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User register Successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Eror registring user", error);
    return Response.json(
      {
        success: false,
        message: "Error registring user",
      },
      {
        status: 500,
      }
    );
  }
}
