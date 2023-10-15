import { notFound } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { getServerSession } from 'next-auth';
import Link from 'next/link';

import { authOptions } from '@/lib/auth';
import { getUserFriendsById } from '@/helpers/get-user-friends-by-id';
import { fetchRedis } from '@/helpers/redis';
import { chatLinkConstructor } from '@/lib/utils';
import Image from 'next/image';

const page = async ({}) => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const friends = await getUserFriendsById(session.user.id);
  const friendsWithLastMessage = await Promise.all(
    friends.map(async (friend) => {
      const [lastMessageRaw] = (await fetchRedis(
        'zrange',
        `chat:${chatLinkConstructor(session.user.id, friend.id)}:messages`,
        -1,
        -1
      )) as string[];

      const lastMessage = JSON.parse(lastMessageRaw) as Message;

      return {
        ...friend,
        lastMessage,
      };
    })
  );

  return (
    <section className='mt-[3.2rem] w-full overflow-x-hidden md:mt-0'>
      <div className='px-5 py-10 font-raleway'>
        <div>
          <h2 className='text-center font-vanillaCream text-3xl text-zinc-800'>
            Welcome to Qualk!
          </h2>
          <p className='mt-2 text-center text-sm font-bold text-gray-600'>
            Greet, Gather, & Gossip! Login and add your friend by google account
            and start chatting.
          </p>
        </div>
        <div className='mt-10' aria-label='Your recent chats'>
          <p className='select-none text-center font-semibold text-gray-400'>
            Your recent chats
          </p>

          {friendsWithLastMessage.length === 0 ? (
            <>
              <p className='mx-auto mt-2 max-w-[600px] text-center text-sm font-semibold  text-gray-500'>
                You have not any recent chat yet, tap on the menu, or check the
                sidebar on the left, and then tap on your {"friend's"} profile
                to start messaging.
              </p>
              <p className='mx-auto mt-4 max-w-[600px] text-center text-sm font-semibold  text-gray-500'>
                Want to chat with the developer. You can add him anytime by just
                sending a friend request to{' '}
                <span className='font-bold text-gray-600'>
                  contact.tamalbiswas@gmail.com
                </span>
                , or check out his latest{' '}
                <a
                  href='https://www.tamalbiswas.com'
                  target='_blank'
                  className='font-bold text-indigo-600'
                >
                  Portfolio
                </a>
                . {"Let's"} get to know each other.
              </p>
            </>
          ) : (
            friendsWithLastMessage.map((friend) => (
              <div
                key={friend.id}
                className='group relative mt-4 rounded-md border border-zinc-200 bg-zinc-50'
              >
                <div className='absolute inset-y-0 right-4 flex items-center'>
                  <ChevronRight className='h-7 w-7 origin-center text-zinc-400 transition-all duration-500 ease-in-out group-hover:h-8 group-hover:w-8 group-hover:translate-x-2 group-hover:text-zinc-600' />
                </div>

                <Link
                  href={`/dashboard/chat/${chatLinkConstructor(
                    session.user.id,
                    friend.id
                  )}`}
                  className='relative justify-center sm:flex'
                >
                  <div className='flex items-center justify-start gap-x-4 p-4 sm:mb-0 sm:mr-4'>
                    <div className='relative h-8 w-8'>
                      <Image
                        referrerPolicy='no-referrer'
                        className='rounded-full'
                        alt={`${friend.name} profile picture`}
                        src={friend.image}
                        fill
                      />
                    </div>

                    <div>
                      <h4 className='text-base font-semibold md:text-lg'>
                        {friend.name}
                      </h4>
                      <p className='max-w-md text-xs md:text-sm'>
                        <span className='text-zinc-400'>
                          {friend.lastMessage.senderId === session.user.id
                            ? 'You: '
                            : ''}
                        </span>
                        {friend.lastMessage.text}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default page;
