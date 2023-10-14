import { notFound } from 'next/navigation';

import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { getUserFriendsById } from '@/helpers/get-user-friends-by-id';
import { fetchRedis } from '@/helpers/redis';
import { chatLinkConstructor } from '@/lib/utils';

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

      return { ...friend, lastMessage };
    })
  );

  return (
    <section className='mt-[3.2rem] w-full overflow-x-hidden md:mt-0'>
      
    </section>
  );
};

export default page;
