import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();
  const { username, content } = await request.json();
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User doest not exist",
        },
        {
          status: 401,
        },
      );
    }

    if (!user.isAcceptingMessages) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting the messages.",
        },
        {
          status: 403,
        },
      );
    }

    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    user.save();
    return Response.json(
      {
        success: true,
        message: "Message sent sucessfully.",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Could send send the message");
    return Response.json(
      {
        success: true,
        message: "Could not send the message",
      },
      {
        status: 500,
      },
    );
  }
}
