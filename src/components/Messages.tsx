'use client';
import { cn, toPusherKey } from '@/lib/utils';
import { Message } from '@/lib/validations/message';
import { FC, useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import Image from 'next/image';
import { pusherClient } from '@/lib/pusher';

interface MessagesProps {
  initialMessages: Message[];
  sessionId: string;
  chatId: string;
  sessionImg: string | null | undefined;
  chatPartner: User;
}

const Messages: FC<MessagesProps> = ({
  initialMessages,
  sessionId,
  chatId,
  chatPartner,
  sessionImg,
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`chat:${chatId}`));

    const newMessageHandler = (messages: Message) => {
      setMessages((prev) => [messages, ...prev]);
    };

    pusherClient.bind('incoming-message', newMessageHandler);

    //? Cleanup
    return () => {
      pusherClient.unsubscribe(toPusherKey(`chat:${chatId}`));

      pusherClient.unbind('incoming-message', newMessageHandler);
    };
  }, []);

  const scrollDownRef = useRef<HTMLDivElement | null>(null);

  const formatTimestamp = (timestamp: number) => {
    return format(timestamp, 'HH:mm');
  };

  return (
    <div
      id='messages'
      className='scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch flex h-full flex-1 flex-col-reverse gap-4 overflow-y-auto p-3'
    >
      <div ref={scrollDownRef} />

      {messages.map((msg, index) => {
        const isCurrUser = msg.senderId === sessionId;

        //? Checking if the user has new messages from the same user in his friendlist
        const newMsgFromSameUser =
          messages[index - 1]?.senderId === messages[index].senderId;

        return (
          <div key={`${msg.id}-${msg.timestamp}`}>
            <div
              className={cn(`flex items-end`, {
                'justify-end': isCurrUser,
              })}
            >
              <div
                className={cn(
                  'mx-2 flex max-w-xs flex-col space-y-2 text-base',
                  {
                    'order-1 items-end': isCurrUser,
                    'order-2 items-start': !isCurrUser,
                  }
                )}
              >
                <span
                  className={cn('inline-block rounded-lg px-4 py-2', {
                    'bg-indigo-600 text-white': isCurrUser,
                    'bg-gray-200 text-gray-800': !isCurrUser,
                    'rounded-br-none': !newMsgFromSameUser && isCurrUser,
                    'rounded-bl-none': !newMsgFromSameUser && !isCurrUser,
                  })}
                >
                  {msg.text}{' '}
                  <span className='ml-2 text-xs text-gray-400'>
                    {formatTimestamp(msg.timestamp)}
                  </span>
                </span>
              </div>

              <div
                className={cn('relative h-6 w-6', {
                  'order-2': isCurrUser,
                  'order-1': !isCurrUser,
                  invisible: newMsgFromSameUser,
                })}
              >
                <Image
                  fill
                  src={isCurrUser ? (sessionImg as string) : chatPartner.image}
                  alt='Profile picture'
                  referrerPolicy='no-referrer'
                  className='rounded-full'
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Messages;
