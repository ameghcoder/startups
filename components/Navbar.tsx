import { auth, signIn, signOut } from '@/auth'
import { BadgePlus, LogOut } from 'lucide-react';
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

async function Navbar() {
    const _session = await auth();

    return (
        <header className='px-5 py-3 bg-white shadow-sm font-work-sans'>
            <nav className='flex justify-between items-center'>
                <Link href="/">
                    <Image src="/logo-text.png" alt='logo' width={145} height={35} />
                </Link>

                <div className="flex items-center gap-5 text-black">
                    {
                        _session && _session?.user ? (
                            <>
                                <Link href="/startup/create">
                                    <span className='max-sm:hidden'>Create</span>
                                    <BadgePlus className='size-6 sm:hidden' />
                                </Link>

                                <form action={async () => {
                                    "use server";
                                    await signOut({ redirectTo: "/" });
                                }}
                                    className='flex gap-2 items-center'
                                >
                                    <button type='submit'>
                                        <span className='max-sm:hidden'>Logout</span>
                                        <LogOut className='size-6 sm:hidden text-primary' />
                                    </button>
                                </form>

                                <Link href={`/user/${_session?.id}`}>
                                    <Avatar className='size-10'>
                                        <AvatarImage src={_session?.user?.image || ''} alt={_session?.user?.name || ''} />
                                        <AvatarFallback>
                                            <Image
                                                src="https://avatar.iran.liara.run/public"
                                                alt='fallback avatar'
                                                width={40}
                                                height={40}
                                            />
                                        </AvatarFallback>
                                    </Avatar>
                                </Link>
                            </>
                        ) : (
                            <>
                                <form action={async () => {
                                    "use server";
                                    await signIn('github');
                                }}>
                                    <button type='submit'>
                                        <span>Login</span>
                                    </button>
                                </form>
                            </>
                        )
                    }
                </div>
            </nav>
        </header>
    )
}

export default Navbar