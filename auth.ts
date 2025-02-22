import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { client } from "./sanity/lib/client"
import { AUTHOR_BY_GITHUB_ID_QUERY } from "./sanity/lib/querys"
import { writeClient } from "./sanity/lib/write-client"

declare module "next-auth" {
  interface Session {
    id: number | string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
  callbacks: {
    async signIn({
      user: {name, email, image},
      profile
    }): Promise<boolean> {

      //! Delete After Check */
      // console.log("GitHub Profile:", profile);

      if (!profile) {
        return false;
      }

      const { id, login, bio } = profile;
      const existingUser = await client.withConfig({useCdn: false}).fetch(AUTHOR_BY_GITHUB_ID_QUERY, { id });

      if(!existingUser){
        await writeClient.create({
          _type: 'author',
          id,
          name,
          username: login,
          email,
          image,
          bio: bio || ''
        })
      }

      if(existingUser){
        return true;
      }

      return true;
    },
    async jwt({token, account, profile}){
      if(account && profile){
        const user = await client
                          .withConfig({useCdn: false})
                          .fetch(
                            AUTHOR_BY_GITHUB_ID_QUERY, 
                            { id: profile?.id } // Ensure profile.id is valid
                          );

        if(user){
          token.id = user._id; // Assign ID from the database
        }
      }

      return token;
    }, 
    async session({ session, token }){
      if(token?.id){
        if (typeof token.id === 'string' || typeof token.id === 'number') {
          session.id = token.id; // Attach ID to session
        }
      }
      
      return session;
    }
  }
})