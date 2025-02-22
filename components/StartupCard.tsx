import { cn, formatDate } from '@/lib/utils'
import { EyeIcon } from 'lucide-react'
import Image from 'next/image';
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button';
import { Author, Startup } from '@/sanity/types';
import { Skeleton } from './ui/skeleton';

export type StartupTypeCard = Omit<Startup, "author"> & { author?: Author};

function StartupCard({ post }: {post: StartupTypeCard}) {
    const {
        _createdAt,
        views,
        author,
        title,
        category, 
        _id, 
        image,
        description
    } = post;

  return (
    <li className='startup-card group'>
        <div className='flex-between'>
            <div className='flex flex-col gap-2'>
                <p className="startup_card_date">
                    {formatDate(_createdAt)}
                </p>
                <div className='flex gap-1.5'>
                    <EyeIcon className='size-6 text-primary' />
                    <span className='text-16-medium'>{views}</span>
                </div>
            </div>
            
            <div className="flex gap-1.5">
                <Link href={`/user/${author?._id}`} className='flex flex-col items-end'>
                    <Image
                        width={40}
                        height={40}
                        alt='user profile image'
                        src={author?.image || "https://avatar.iran.liara.run/public"}
                        className='border border-primary/25 rounded-full transition-all hover:scale-105'
                    />
                    <p className="text-16-medium line-clamp-1 hover:font-semibold">{author?.name}</p>
                </Link>
            </div>

        </div>
        <div className="flex-between mt-5 gap-5">
            <div className="flex-1">
                <Link href={`/startup/${_id}`}>
                    <h3 className="text-26-semibold line-clamp-1">
                        {title}
                    </h3>
                </Link>
            </div>
        </div>
        <Link href={`/startup/${_id}`}>
            <p className="startup-card_desc">
                {description}
            </p>

            <Image 
                src={image || "https://placehold.co/1280x720"}
                width={1280}
                height={720}
                alt={`image of ${title}`}
                className='startup-card_img'
            />
        </Link>
        <div className="flex-between gap-3 mt-5">
            <Link href={`/?query=${category?.toLowerCase()}`}>
                <p className='text-16-medium'>{category}</p>
            </Link>
            <Button className='startup-card_btn' asChild>
                <Link href={`/startup/${_id}`}>
                    <span>Details</span>
                </Link>
            </Button>
        </div>

    </li>
  )
}

export const StartupCardSkeleton = () => (
    <>
        {
            [0, 1, 2, 3].map((i) => (
                <li key={cn("skeleton", i)}>
                    <Skeleton 
                        className="startup-card_skeleton"
                    />
                </li>
            ))
        }
    </>
)

export default StartupCard
