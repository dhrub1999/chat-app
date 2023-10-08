'use client';
import { FC } from 'react';
import Link from 'next/link';
import LottiePlayer from './LottiePlayer';
import Button from './ui/Button';

interface NoFriendRequestLayoutProps {}

const NoFriendRequestLayout: FC<NoFriendRequestLayoutProps> = ({}) => {
  return (
    <main className='custom-scrollbar max-h-full'>
      <LottiePlayer src='/animations/no-friend-requests.json' />
      <p className='mt-4 text-center font-raleway font-medium text-gray-600'>
        You have no friend requests!
      </p>
      <p className='mt-2 text-center font-raleway font-semibold text-gray-700'>
        Want to add a friend?
      </p>
      <Link href='/dashboard/add' aria-label='Add friend button'>
        <Button className='mt-6'>Add a friend</Button>
      </Link>
    </main>
  );
};

export default NoFriendRequestLayout;
