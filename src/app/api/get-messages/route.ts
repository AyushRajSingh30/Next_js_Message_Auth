//getServerSession provide by next auth we already provide user in session that time we easly access user from session.We need to pass authOption in this session as parameter
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

//by using this method we see all message of user
export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  console.log("get-message user", user);

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authincated",
      },
      { status: 401 }
    );
  }

  //this is special case in aggregation pipeline line we extract userid by this method.
  //extract user_id from mongodb converd into mongoose user id and than we send to agression pipe line this is only method to pass user_id in aggression pipeline
  const userId = new mongoose.Types.ObjectId(user._id);
  const mess= await UserModel.findById(user._id);
  console.log("mess", mess);
  try {
    const user = await UserModel.aggregate([
      //match user by userId  we write field in aggregate we used $ sing
      { $match: { _id: userId } },

      //unwind specily used for array is break array into object {id:1, username:example, messagess[{m1},{m2}]} after applying unwind it look like {{id:1, username:example, messagess:{m1}}, {id:1, username:example, messagess:{m2}}}    in this case messages is a mongodb element that why we directly taken in string.

      { $unwind: "$messages" },
      //we used -1 in sort for accending sort
      { $sort: { "messages.createdAt": -1 } },
      // $group: Groups the documents by the user ID and pushes the messages array into a single document. {id:1_id, messages:[{id:1_id, message:context}, {id:1_id, message:context}]}
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!user || user.length == 0) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 401 }
      );
    }

    return Response.json(
      {
        success: true,
        messages: user[0].messages,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        messages: "An Unexperted error occured",
      },
      { status: 500 }
    );
  }
}
