'use client';

import { FC, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { chatLinkConstructor } from '@/lib/utils';

interface SideBarChatListProps {
  friends: User[];
  sessionId: string;
}

const SideBarChatList: FC<SideBarChatListProps> = ({ friends, sessionId }) => {
  const router = useRouter();
  const pathName = usePathname();
  const [unseenMsgs, setUnseenMsgs] = useState<Message[]>([]);

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
      {friends.sort().map((friend) => {
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
