import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const _user: User = session?.user as User;
  if (!_user || !session) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      {
        status: 401,
      },
    );
  }
  try {
    const userId = new mongoose.Types.ObjectId(_user._id);
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "messages" } } },
    ]).exec();

    if (!user || user.length == 0) {
      return Response.json(
        {
          message: "User not found",
          success: false,
        },
        {
          status: 404,
        },
      );
    }

    return Response.json(
      {
        messages: user[0].messages,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error fetching the messages");
    return Response.json(
      {
        sucess: false,
        message: "Error fetching the messages",
      },
      {
        status: 500,
      },
    );
  }
}
