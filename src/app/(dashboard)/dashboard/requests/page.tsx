import { FC } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { notFound } from 'next/navigation';
import { fetchRedis } from '@/helpers/redis';
import FriendRequests from '@/components/FriendRequests';
import HeroBg from '@/components/ui/HeroBg';

const page: FC = async () => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  //? Ids of the user's new friend request profiles
  const incomingProfileIds = (await fetchRedis(
    `smembers`,
    `user:${session.user.id}:incoming_friend_requests`
  )) as string[];

  const incomimingFriendRequests = await Promise.all(
    incomingProfileIds.map(async (senderId) => {
      const sender = (await fetchRedis('get', `user:${senderId}`)) as string;
      const parsedSender = JSON.parse(sender) as User;
      return {
        senderId,
        senderEmail: parsedSender.email,
      };
    })
  );

  return (
    <main className='mt-10 grid h-full w-full place-content-center place-items-center'>
      <section className='container relative rounded-md bg-faded-white px-8 py-16 text-center shadow-md backdrop-blur-[120px] md:px-10 md:py-20 lg:rounded-lg lg:px-12 lg:py-24'>
        <h3 className='mb-8 font-vanillaCream text-3xl text-gray-900'>
          All friend requests.
        </h3>
        <div className='flex flex-col gap-4'>
          <FriendRequests
            incomingFriendRequests={incomimingFriendRequests}
            sessionId={session.user.id}
          />
        </div>
      </section>
    </main>
  );
};

export default page;
