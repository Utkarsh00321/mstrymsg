import NextAuth from "next-auth"; // Importing the NextAuth library for authentication
import { authOptions } from "./options"; // Importing authentication options from the 'options' file

// Creating the NextAuth handler with the provided authentication options
const handler = NextAuth(authOptions);

// Exporting the handler for GET and POST requests
export { handler as GET, handler as POST };
