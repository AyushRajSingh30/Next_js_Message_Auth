//getServerSession provide by next auth we already provide user in session that time we easly access user from session.We need to pass authOption in this session as parameter
//this getServerSession is only used in backend for access session you also used gesession
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";

//POST request for change the status of acceptMessagel̥
export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authincated",
      },
      { status: 401 }
    );
  }

  const userId = user?._id;

  const { acceptMessage } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessage },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "falied to update user status to accept message",
        },
        { status: 401 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message acceptance status update successfully",
        updatedUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Failed to update user state to accept accept message");
    return Response.json(
      {
        success: false,
        message: "Failed to update user state to accept accept message",
      },
      { status: 500 }
    );
  }
}

//GET request for get the status of accept message
export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authincated",
      },
      { status: 401 }
    );
  }

  const userId = user?._id;
  try {
    const foundUser = await UserModel.findById(userId);

    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        isAcceptingMessage: foundUser.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to update user state to accept accept message");
    return Response.json(
      {
        success: false,
        message: "Error is getting message acceptance status",
      },
      { status: 500 }
    );
  }
}
