/* eslint-disable @next/next/no-img-element */

import StartupCard, { StartupTypeCard } from '@/components/StartupCard';
import { formatDate } from '@/lib/utils';
import { client } from '@/sanity/lib/client';
import { PLAYLIST_BY_SLUG_QUERY, STARTUP_BY_ID_QUERY } from '@/sanity/lib/querys';
import { ArrowDownCircle } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react'

import markdownit from 'markdown-it';
import { Skeleton } from '@/components/ui/skeleton';
import View from '@/components/View';

const md = markdownit();

// export const experimental_staticRegeneration = true
export const revalidate = true;

export const experimental_serverComponents = true
export const experimental_ppr = true

async function page({ params }: {
    params: Promise<{ id?: string }>
}) {
    const id = (await params).id;

    // Parallel Method to Fetch Data (takes less time then sequential)
    const [post, editorPosts] = await Promise.all([
        client.fetch<StartupTypeCard>(STARTUP_BY_ID_QUERY, { id }),
        client.fetch<StartupTypeCard[]>(PLAYLIST_BY_SLUG_QUERY, { slug: 'editor-picks'})
    ]);


    // Sequential Method to Fetch Data (takes too much time)
    // const post = await client.fetch<StartupTypeCard>(STARTUP_BY_ID_QUERY, { id });
    // const {select: editorPosts} = await client.fetch(PLAYLIST_BY_SLUG_QUERY, { slug: 'editor-picks'});

    if(!post) return notFound();

    const parsedContent = md.render(post?.pitch || '')

    return (
        <>
            <section className="pink_container relative">
                <p className="tag">{formatDate(post?._createdAt)}</p>
                <h1 className="heading">{post.title}</h1>
                <p className="sub-heading !max-w-5xl">{post.description}</p>
                <Link href='#pitch-details' className='w-fit flex gap-2 absolute px-8 py-2 bottom-8 left-1/2 transform -translate-x-1/2 bg-background rounded-full'>
                   <p className='text-16-medium'>Read More</p>
                   <ArrowDownCircle className='text-primary' />
                </Link>
            </section>
            <section id='pitch-details' className="section_container">
                <div className="mt-6 max-w-4xl mx-auto space-y-5">
                    
                    <div className="flex-between gap-5 border-b border-border px-4">
                        <Link href={`/user/${post.author?._id}`} className='flex gap-2 items-center mb-3'>
                            <img 
                                width={64}
                                height={64}
                                alt='user profile image'
                                className='rounded-full border border-border drop-shadow-lg'
                                src={ post.author?.image || "https://avatar.iran.liara.run/public"}
                            />
                            <div>
                                <p className="text-20-medium">{post.author?.name}</p>
                                <p className="text-16-medium !text-black-300">@{post.author?.username}</p>
                            </div>
                        </Link>
                        <div className='flex gap-5'>
                            <Link href={`/?query=${post.category}`}>
                                <p className="category-tag w-fit">{post.category}</p>
                            </Link>
                        </div>
                    </div>
                    
                    <img 
                        src={post.image || 'https://via.placeholder.com/800x400'}
                        alt={post.title || 'startup image'}
                        width={800}
                        height={200}
                        className='rounded-lg w-full max-h-96 object-cover'
                    />

                    <h3 className="text-30-bold">Pitch Details</h3>

                    {
                        parsedContent ? (
                            <article 
                                className='prose max-w-4xl font-work-sans break-all'
                                dangerouslySetInnerHTML={{ __html: parsedContent }}
                            />
                        ) : (
                            <p className="no-result">
                                No details provided
                            </p>
                        )
                    }
                </div>

                <hr className="divider" />

                {
                    editorPosts?.length > 0 && (
                        <div className="max-w-4xl mx-auto">
                            <p className="text-30-semibold">Editor Picks</p>

                            <ul className='mt-7 card_grid-sm'>
                                {editorPosts.map((post: StartupTypeCard, i: number) => (
                                    <StartupCard 
                                        post={post}
                                        key={i}
                                    />
                                ))}
                            </ul>
                        </div>
                    )
                }

                <Suspense fallback={<Skeleton />}>
                    <View id={id ?? ""} />
                </Suspense>
            </section>
        </>
    )
}

export default page
