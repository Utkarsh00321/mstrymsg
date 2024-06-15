import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();

    // Find existing user by username
    const existingVerifiedUserByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    // If existing user is verified
    if (existingVerifiedUserByUsername) {
      return Response.json(
        {
          success: false,
          message: "User already exists",
        },
        { status: 400 },
      );
    }

    // Finding the user by email
    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    // If user is found
    if (existingUserByEmail) {
      // If the user is already verified
      if (existingUserByEmail.isVerified) {
        return Response.json(
          { sucess: false, message: "User already exists" },
          { status: 400 },
        );
      }
      // If user exists and is not verified we update the password and verification code
      else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600);
        await existingUserByEmail.save();
      }
    }
    // If user is not found means he does not exist in database. Create a new user and save to
    else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date(Date.now() + 3600);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });

      await newUser.save();
    }

    // send verificatin email to user who already exists but are not verified or a new user
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode,
    );
    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: emailResponse.message },
        { status: 500 },
      );
    } else {
      return Response.json(
        { success: true, message: "Please verify your account." },
        { status: 201 },
      );
    }
  } catch (error) {
    console.error("Error registering user:", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      { status: 500 },
    );
  }
}
