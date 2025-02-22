import { client } from '@/sanity/lib/client'
import { STARTUPS_BY_AUTHOR_QUERY } from '@/sanity/lib/querys'
import React from 'react'
import StartupCard, { StartupTypeCard } from './StartupCard';

const UserStartups = async ({ id }: { id: string }) => {

    const startups = await client.fetch<StartupTypeCard[]>(STARTUPS_BY_AUTHOR_QUERY, { id });

    return (
        <>
            {
                startups?.length > 0 ? startups.map((post: StartupTypeCard, i: number) => (
                    <StartupCard 
                        post={post}
                        key={i}
                    />
                )) : <p className="no-result">No posts yet</p>
            }
        </>
    )
}

export default UserStartups
