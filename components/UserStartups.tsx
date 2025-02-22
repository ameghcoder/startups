import { client } from '@/sanity/lib/client'
import { STARTUPS_BY_AUTHOR_QUERY } from '@/sanity/lib/querys'
import React from 'react'
import StartupCard, { StartupTypeCard } from './StartupCard';
// import { auth } from '@/auth';

const UserStartups = async ({ id }: { id: string }) => {

    const startups = await client.fetch<StartupTypeCard[]>(STARTUPS_BY_AUTHOR_QUERY, { id });

    // get the session id
    // const session = await auth();

    // set prop for the startup card
    const removeBtnStatus = false;

    // compare the session id with the user id
    // removeBtnStatus = session?.id == id;

    return (
        <>
            {
                startups?.length > 0 ? startups.map((post: StartupTypeCard, i: number) => (
                    <StartupCard 
                        post={post}
                        key={i}
                        removeBtnStatus={removeBtnStatus}
                    />
                )) : <p className="no-result">No posts yet</p>
            }
        </>
    )
}

export default UserStartups
