import { Icon, Icons } from '@/components/Icons';
import SideBarChatList from '@/components/SidebarChatList';
import SignOutButton from '@/components/SignOutButton';
import UserFriendRequestInSidebar from '@/components/UserFriendRequestInSidebar';
import { getUserFriendsById } from '@/helpers/get-user-friends-by-id';
import { fetchRedis } from '@/helpers/redis';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FC, ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

interface UserOptions {
  id: number;
  name: string;
  href: string;
  Icon: Icon;
}

const userOptions: UserOptions[] = [
  {
    id: 1,
    name: 'Add friend',
    href: '/dashboard/add',
    Icon: 'UserPlus',
  },
];

const Layout = async ({ children }: LayoutProps) => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const friends = await getUserFriendsById(session.user.id);

  //? This fn will return the number of friend requests the authenticated user has

  const friendReqCount = (
    (await fetchRedis(
      'smembers',
      `user:${session.user.id}:incoming_friend_requests`
    )) as User[]
  ).length;

  return (
    <div className='flex h-screen w-full'>
      <div className='flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto overflow-x-hidden border-r border-gray-200 bg-white px-6'>
        <Link
          href='/dashboard'
          className='flex h-16 shrink-0 items-center gap-x-2'
        >
          <Icons.Logo className='h-12 w-auto fill-indigo-600' />
          <p className='font-vanillaCream text-2xl text-zinc-800'>Qualk</p>
        </Link>

        {friends.length > 0 ? (
          <div className='font-raleway text-xs font-semibold leading-6 text-gray-400'>
            Your chats
          </div>
        ) : null}

        <nav className='flex flex-1 flex-col'>
          <ul role='list' className='flex flex-1 flex-col gap-y-7'>
            {/* //? User's chats here */}

            <li>
              <SideBarChatList sessionId={session.user.id} friends={friends} />
            </li>

            <li>
              <div className='text-xs font-semibold leading-6 text-gray-400'>
                Overview
              </div>

              <ul role='list' className='-mx-2 mt-2 space-y-1'>
                {userOptions.map((option) => {
                  const Icon = Icons[option.Icon];
                  return (
                    <li key={option.id}>
                      <Link
                        href={option.href}
                        className='group flex gap-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 transition-colors duration-200 ease-in hover:bg-gray-50 hover:text-indigo-600'
                      >
                        <span className='flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-[0.72rem] font-medium text-gray-400 transition-colors duration-200 ease-in group-hover:border-indigo-600 group-hover:text-indigo-600'>
                          <Icon className='h-4 w-4' />
                        </span>
                        <span className='truncate'>{option.name}</span>
                      </Link>
                    </li>
                  );
                })}
                <li>
                  <UserFriendRequestInSidebar
                    userFriendRequestCount={friendReqCount}
                    sessionId={session.user.id}
                  />
                </li>
              </ul>
            </li>

            {/* //? User's Friend requests will show up here */}

            <li className=' mt-auto flex items-center'>
              <div className='flex flex-1 items-center gap-x-4 py-3 text-sm font-semibold leading-6 text-gray-900'>
                <div className='relative h-8 w-8 bg-gray-50'>
                  <Image
                    fill
                    referrerPolicy='no-referrer'
                    className='rounded-full'
                    src={session.user.image || ''}
                    alt='Your profile picture'
                  />
                </div>

                {/* // "sr-only" stands for "screen reader only, its a bunch of css properties for the people who are using screen readers." */}

                <span className='sr-only'>Your profile</span>
                <div className='flex flex-col'>
                  <span aria-hidden='true'>{session.user.name}</span>
                  <span className='text-xs text-zinc-400' aria-hidden='true'>
                    {session.user.email}
                  </span>
                </div>
              </div>

              <SignOutButton className='aspect-square h-full' />
            </li>
          </ul>
        </nav>
      </div>
      {children}
    </div>
  );
};

export default Layout;
