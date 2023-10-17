'use client';

import { FC, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { chatLinkConstructor, toPusherKey } from '@/lib/utils';
import { pusherClient } from '@/lib/pusher';
import toast from 'react-hot-toast';
import ChatToast from './ChatToast';

interface SideBarChatListProps {
  friends: User[];
  sessionId: string;
}

interface ExtendedMessage extends Message {
  senderImg: string;
  senderName: string;
}

const SideBarChatList: FC<SideBarChatListProps> = ({ friends, sessionId }) => {
  const router = useRouter();
  const pathName = usePathname();
  const [unseenMsgs, setUnseenMsgs] = useState<Message[]>([]);
  const [activeChats, setActiveChats] = useState<User[]>(friends);

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`));

    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`));

    const newFriendHandler = (newFriend: User) => {
      setActiveChats((prev) => [...prev, newFriend]);
    };
    const chatHandler = (message: ExtendedMessage) => {
      const shouldNotify =
        pathName !==
        `/dashboard/chat/${chatLinkConstructor(sessionId, message.senderId)}`;

      if (!shouldNotify) return;

      toast.custom((t) => (
        //? Custom Component
        <ChatToast
          t={t}
          sessionId={sessionId}
          senderId={message.senderId}
          senderImg={message.senderImg}
          senderMessage={message.text}
          senderName={message.senderName}
        />
      ));
      setUnseenMsgs((prev) => [...prev, message]);
    };

    pusherClient.bind(`new_message`, chatHandler);
    pusherClient.bind('new_friend', newFriendHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:chats`));
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`));

      pusherClient.unbind('new_message', chatHandler);
      pusherClient.unbind('new_friend', newFriendHandler);
    };
  }, [pathName, sessionId, router]);

  //? Checking the credentials for checking new messages for the user.
  useEffect(() => {
    if (pathName?.includes('chat')) {
      setUnseenMsgs((prev) => {
        return prev.filter((msg) => !pathName.includes(msg.senderId));
      });
    }
  }, [pathName]);

  return (
    <ul role='list' className='oberflow-y-auto -mx-2 max-h-[25rem] space-y-1'>
      {activeChats.sort().map((friend) => {
        const unseenMsgsNum = unseenMsgs.filter((unseenMsg) => {
          return unseenMsg.senderId === friend.id;
        }).length;
        return (
          <li key={friend.id}>
            <a
              href={`/dashboard/chat/${chatLinkConstructor(
                sessionId,
                friend.id
              )}`}
              className='group flex items-center gap-x-3 rounded-md p-2 font-raleway text-sm font-semibold leading-6 text-gray-700 transition-all duration-200 ease-in hover:bg-gray-50 hover:text-indigo-600'
            >
              {friend.name}
              {unseenMsgsNum > 0 ? (
                <div className='flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-xs font-medium text-white'>
                  {unseenMsgsNum}
                </div>
              ) : null}
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default SideBarChatList;
