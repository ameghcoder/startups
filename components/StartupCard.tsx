import { cn } from '@/lib/utils'
import Image from 'next/image';
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button';
import { Author, Startup } from '@/sanity/types';
import { Skeleton } from './ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { X } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  

export type StartupTypeCard = Omit<Startup, "author"> & { author?: Author };

interface StartupCardProps {
    post: StartupTypeCard;
    removeBtnStatus?: boolean;
}

const StartupCard: React.FC<StartupCardProps> = ({ post, removeBtnStatus = false }) => {
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

    const date = new Date(_createdAt);
    const distanceDate = formatDistanceToNow(date, {addSuffix: true});
    

    return (
        <>
            <li className='startup-card_new group'>
                {/* User Profile */}
                <div className='startup-card-author_new'>
                    <Link href={`/user/${author?._id}`} className='flex gap-2 items-center'>
                        <Image
                            width={40}
                            height={40}
                            alt='user profile image'
                            src={author?.image || "https://avatar.iran.liara.run/public"}
                            className='border border-primary/25 rounded-full transition-all hover:scale-105'
                        />
                        <div>
                            <p className="text-16-medium line-clamp-1 -mt-2 hover:font-semibold">{author?.name}</p>
                        </div>
                    </Link>

                    {/* Remove Post Button (only available for user who own this posts) */}
                    {   
                        removeBtnStatus &&(
                            <>
                                <Dialog>
                                    <DialogTrigger>
                                        <Button variant="destructive" className='px-2 py-1 h-6 transition-all hover:shadow-md hover:-translate-y-1'>
                                            <span className='text-12-tiny !text-white'>Remove</span>
                                            <X size={16} />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                                            <DialogDescription>
                                                This action cannot be undone. This will delete your post permanently.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter>
                                            <Button variant="destructive">
                                                Delete Post
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </>
                        )
                    }
                </div>

                {/* Post Details */}
                <div className="startup-card-details_new">
                    <div>
                        {/* title & description*/}
                        <h3 className="text-26-semibold line-clamp-1">
                            {title}
                        </h3>
                        <p className="startup-card-desc_new">
                            {description}
                        </p>
                    </div>
                    <div>
                        {/* image */}
                        <Link href={`/startup/${_id}`}>
                            <Image
                                src={image || "https://placehold.co/1280x720"}
                                width={1280}
                                height={720}
                                alt={`image of ${title}`}
                                className='startup-card_img'
                            />
                        </Link>

                        {/* Post Analytics */}
                        <div className="startup-card-analytics_new">
                            <div>
                                <span className="text-12-tiny capitalize">{distanceDate}</span>
                            </div>
                            <span role='separator'>•</span>
                            <div>
                                <span className='text-12-tiny'>{views} views</span>
                            </div>
                        </div>
                        {/* Category & More Details */}
                        <div className="flex-between gap-3">
                            <Link href={`/?query=${category?.toLowerCase()}`}>
                                <p className='text-16-medium'>{category}</p>
                            </Link>
                            <Button className='startup-card_btn' asChild>
                                <Link href={`/startup/${_id}`}>
                                    <span>Details</span>
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </li>
        </>
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
