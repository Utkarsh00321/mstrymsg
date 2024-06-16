import "next-auth"; // Importing the next-auth library for type augmentation

// Augmenting the 'next-auth' module to extend the User and Session interfaces
declare module 'next-auth' {
    // Extending the User interface to include custom properties
    interface User {
        _id?: string; // Optional property for the user ID
        isVerified?: boolean; // Optional property to check if the user is verified
        isAcceptingMessages?: boolean; // Optional property to check if the user is accepting messages
        username?: string; // Optional property for the username
    }

    // Extending the Session interface to include custom properties in the user object
    interface Session {
        user: {
            _id?: string; // Optional property for the user ID
            isVerified?: boolean; // Optional property to check if the user is verified
            isAcceptingMessages?: boolean; // Optional property to check if the user is accepting messages
            username?: string; // Optional property for the username
        } & DefaultSession['user']; // Including the default properties from DefaultSession's user
    }
}

// Augmenting the 'next-auth/jwt' module to extend the JWT interface
declare module 'next-auth/jwt' {
    // Extending the JWT interface to include custom properties in the user object
    interface JWT {
        user: {
            _id?: string; // Optional property for the user ID
            isVerified?: boolean; // Optional property to check if the user is verified
            isAcceptingMessages?: boolean; // Optional property to check if the user is accepting messages
            username?: string; // Optional property for the username
        }
    }
}
