'use client';

import { FC, useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Check, UserPlus, X } from 'lucide-react';

import NoFriendRequestLayout from './NoFriendRequestLayout';
import { pusherClient } from '@/lib/pusher';
import { toPusherKey } from '@/lib/utils';

interface FriendRequestsProps {
  incomingFriendRequests: IncomingFriendRequest[];
  sessionId: string;
}

const FriendRequests: FC<FriendRequestsProps> = ({
  incomingFriendRequests,
  sessionId,
}) => {
  const router = useRouter();
  const [friendReq, setFriendReq] = useState<IncomingFriendRequest[]>(
    incomingFriendRequests
  );

  //? Push notifications from pusher
  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:incoming_friend_requests`)
    );

    const friendReqHandler = ({
      senderId,
      senderEmail,
    }: IncomingFriendRequest) => {
      setFriendReq((prev) => [...prev, { senderId, senderEmail }]);
    };

    pusherClient.bind(`incoming_friend_requests`, friendReqHandler);

    //? Cleanup
    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:incoming_friend_requests`)
      );
      pusherClient.unbind(`incoming_friend_requests`, friendReqHandler);
    };
  }, [sessionId]);

  const acceptFriend = async (senderId: string) => {
    try {
      await axios.post('/api/friends/accept', { id: senderId });

      setFriendReq((prev) =>
        prev.filter((request) => request.senderId !== senderId)
      );
      router.refresh();
    } catch (error) {
      console.error('Error while accepting friend request', error);
    }
  };

  const rejectFriend = async (senderId: string) => {
    try {
      await axios.post('/api/friends/reject', { id: senderId });

      setFriendReq((prev) =>
        prev.filter((request) => request.senderId !== senderId)
      );
      router.refresh();
    } catch (error) {
      console.error('Error rejecting a friend', error);
    }
  };

  return (
    <>
      {friendReq.length === 0 ? (
        // <p className='text-sm text-zinc-500'>Nothing to show here...</p>
        <NoFriendRequestLayout />
      ) : (
        friendReq.map((req) => (
          <div
            key={req.senderId}
            className='flex items-center gap-4 rounded-full bg-slate-200 p-2 shadow-md'
          >
            <div className='grid h-8 w-8 place-items-center rounded-full bg-transparent shadow-md'>
              <UserPlus className='h-5 w-5 text-black' />
            </div>
            <p className='text-lg font-medium'>{req.senderEmail}</p>
            <button
              onClick={() => acceptFriend(req.senderId)}
              aria-label='accept friend'
              className='grid h-8 w-8 place-items-center rounded-full bg-indigo-600 transition hover:bg-indigo-700 hover:shadow-md'
            >
              <Check className='h-3/4 w-3/4 font-semibold text-white' />
            </button>

            <button
              aria-label='reject friend'
              className='grid h-8 w-8 place-items-center rounded-full bg-red-600 transition hover:bg-red-700 hover:shadow-md'
            >
              <X className='h-3/4 w-3/4 font-semibold text-white' />
            </button>
          </div>
        ))
      )}
    </>
  );
};

export default FriendRequests;
