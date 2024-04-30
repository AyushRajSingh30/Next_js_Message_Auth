import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";

import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  console.log("email :", email);
  try {
    const Emaildetail = await resend.emails.send({
      //if we add domain name in resend than you send mail to other account other whise only send to admin emailID.
      from: "onboarding@resend.dev",
      to: email,
      subject: "Verification Code",
      react: VerificationEmail({ username: username, otp: verifyCode }),
    });
    console.log("Emaildetails :", Emaildetail);
    return { success: true, message: "verification email successfully" };
  } catch (emailError) {
    console.error("Error sending verification email", emailError);
    return { success: false, message: "failed to send verification email" };
  }
}
