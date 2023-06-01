import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import User from '@models/user';
import Admin from '@models/admin';
import { connectToDB } from '@utils/database';

var adminEmails = []

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        })
    ],
    callbacks: {
        async session({ session, token, user }) {

            try {

                await connectToDB();

                const data = await Admin.find()
                data.map(admin => adminEmails.push(admin.email))
                console.log(adminEmails)

                if (adminEmails.includes(session?.user?.email)) {

                    const sessionUser = await User.findOne({ email: session.user.email });
                    session.user.id = sessionUser._id.toString();
                    adminEmails = []
                    return session;
                }

                else {
                    return false
                }

            }
            catch (err) {
                console.log(err.message)
            }
        },
        async signIn({ profile }) {
            try {
                await connectToDB();

                const userExists = await User.findOne({ email: profile.email });

                if (!userExists) {
                    await User.create({
                        email: profile.email,
                        name: profile.name,
                        image: profile.picture,
                    });
                }

                return true
            } catch (error) {
                console.log("Error checking if user exists: ", error.message);
                return false
            }
        },
    }
})

export { handler as GET, handler as POST }