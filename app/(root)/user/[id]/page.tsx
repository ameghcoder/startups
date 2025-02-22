import { auth } from '@/auth';
import { StartupCardSkeleton } from '@/components/StartupCard';
import UserStartups from '@/components/UserStartups';
import { client } from '@/sanity/lib/client';
import { AUTHOR_BY_ID_QUERY } from '@/sanity/lib/querys';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react'

export const experimental_ppr = true;

const page = async (
    { params }: { params: Promise<{ id?: string }> }
) => {
    const id = (await params).id;
    const session = await auth();

    const user = await client.fetch(AUTHOR_BY_ID_QUERY, { id });
    if (!user) return notFound();

    return (
        <>
            <section className="profile_container">
                <div className="profile_card">
                    <div className="profile_title">
                        <h3 className="text-24-black uppercase text-center">
                            {user.name}
                        </h3>
                    </div>
                    <Image
                        src={user.image || "https://avatar.iran.liara.run/public"}
                        alt="profile image"
                        width={150}
                        height={150}
                        className="rounded-full"
                    />

                    <p className="text-30-extrabold mt-7 text-center">
                        @{user.name}
                    </p>
                    <p className="mt-1 text-center text-14-normal">
                        {user?.bio}
                    </p>
                </div>


                <div className="flex-1 flex flex-col gap-5 lg:-mt-5">
                    <p className="text-30-bold">
                        {session?.id === id ? "Your": "All"} Startups
                    </p>
                    <ul className="mt-7 card_grid">
                        <Suspense fallback={<StartupCardSkeleton />}>
                            {id && <UserStartups id={id} />}
                        </Suspense>
                    </ul>
                </div>
            </section>
        </>
    )
}

export default page
