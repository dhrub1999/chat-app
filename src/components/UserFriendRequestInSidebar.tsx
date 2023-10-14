'use client';

import { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import { User } from 'lucide-react';
import { pusherClient } from '@/lib/pusher';
import { toPusherKey } from '@/lib/utils';

interface UserFriendRequestInSidebarProps {
  sessionId: string;
  userFriendRequestCount: number;
}

const UserFriendRequestInSidebar: FC<UserFriendRequestInSidebarProps> = ({
  userFriendRequestCount,
  sessionId,
}) => {
  const [newFriendRequests, setNewFriendRequests] = useState<number>(
    userFriendRequestCount
  );

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:incoming_friend_requests`)
    );
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`));

    const friendRequestHandler = () => {
      setNewFriendRequests((prev) => prev + 1);
    };

    const addFriendHandler = () => {
      setNewFriendRequests((prev) => prev - 1);
    };

    pusherClient.bind(`incoming_friend_requests`, friendRequestHandler);
    pusherClient.bind('new_friend', addFriendHandler);

    //? Cleanup
    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:incoming_friend_requests`)
      );

      pusherClient.unbind(`incoming_friend_requests`, friendRequestHandler);

      pusherClient.unbind(`new_friend`, addFriendHandler);
    };
  }, [sessionId]);

  return (
    <Link
      href='/dashboard/requests'
      className='group flex items-center gap-x-3 rounded-md p-2 font-raleway text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
    >
      <div className='flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white font-raleway text-[0.72rem] font-medium text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600'>
        <User className='h-4 w-4' />
      </div>
      <p className='truncate'>Friend requests</p>
      {newFriendRequests > 0 ? (
        <div className='flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs text-white'>
          {newFriendRequests}
        </div>
      ) : null}
    </Link>
  );
};

export default UserFriendRequestInSidebar;
