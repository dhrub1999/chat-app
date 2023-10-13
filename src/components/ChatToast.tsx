import { chatLinkConstructor, cn } from '@/lib/utils';
import Image from 'next/image';
import { FC } from 'react';
import toast, { type Toast } from 'react-hot-toast';

interface ChatToastProps {
  t: Toast;
  sessionId: string;
  senderId: string;
  senderImg: string;
  senderName: string;
  senderMessage: string;
}

const ChatToast: FC<ChatToastProps> = ({
  t,
  sessionId,
  senderId,
  senderImg,
  senderName,
  senderMessage,
}) => {
  return (
    <div
      className={cn(
        'pointer-events-auto flex w-full max-w-md rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5',
        {
          'animate-enter': t.visible,
          'animate-leave': !t.visible,
        }
      )}
    >
      <a
        onClick={() => toast.dismiss(t.id)}
        href={`/dashboard/chat/${chatLinkConstructor(sessionId, senderId)}`}
        className='w-0 flex-1 p-4'
      >
        <div className='flex items-start'>
          <div className='flex-shrink-0 pt-0.5'>
            <div className='relative h-10 w-10'>
              <Image
                fill
                referrerPolicy='no-referrer'
                className='rounded-full'
                src={senderImg}
                alt={`${senderName} profile picture`}
              />
            </div>
          </div>

          <div className='ml-3 flex-1'>
            <p className='font-raleway text-sm font-semibold text-gray-900'>
              {senderName}
            </p>
            <p className='mt-1 font-raleway text-sm text-gray-500'>
              {senderMessage}
            </p>
          </div>
        </div>
      </a>

      <div className='flex border-l border-gray-200'>
        <button
          onClick={() => toast.dismiss(t.id)}
          className='flex w-full items-center justify-center rounded-none rounded-r-lg border border-transparent p-4 text-sm font-medium text-indigo-600 focus-within:ring-2 hover:text-indigo-500 focus:outline-none focus:ring-indigo-500'
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ChatToast;
