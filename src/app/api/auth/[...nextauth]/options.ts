import { NextAuthOptions } from 'next-auth'; // Importing the NextAuthOptions type from next-auth
import CredentialsProvider from 'next-auth/providers/credentials'; // Importing the CredentialsProvider for custom authentication
import bcrypt from 'bcryptjs'; // Importing bcryptjs for password hashing and comparison
import dbConnect from '@/lib/dbConnect'; // Importing the database connection utility
import UserModel from '@/model/User'; // Importing the User model

// Exporting the NextAuth configuration object
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials', // Setting the ID for the credentials provider
      name: 'Credentials', // Setting the name for the credentials provider
      credentials: {
        email: { label: 'Email', type: 'text' }, // Defining the email credential field
        password: { label: 'Password', type: 'password' }, // Defining the password credential field
      },
      // Authorization function to validate user credentials
      async authorize(credentials: any): Promise<any> {
        await dbConnect(); // Connecting to the database
        try {
          // Finding a user by email or username
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });
          if (!user) {
            throw new Error('No user found with this email'); // Throw an error if no user is found
          }
          if (!user.isVerified) {
            throw new Error('Please verify your account before logging in'); // Throw an error if the user is not verified
          }
          // Comparing the provided password with the stored hashed password
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (isPasswordCorrect) {
            return user; // Return the user object if the password is correct
          } else {
            throw new Error('Incorrect password'); // Throw an error if the password is incorrect
          }
        } catch (err: any) {
          throw new Error(err); // Throw any other errors encountered
        }
      },
    }),
  ],
  callbacks: {
    // Callback to modify the JWT token
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString(); // Convert ObjectId to string
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token;
    },
    // Callback to modify the session object
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt', // Using JWT strategy for session management
  },
  secret: process.env.NEXTAUTH_SECRET, // Secret for signing the JWT
  pages: {
    signIn: '/sign-in', // Custom sign-in page
  },
};
