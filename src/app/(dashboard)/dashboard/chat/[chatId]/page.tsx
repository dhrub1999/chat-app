import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import Image from 'next/image';

import ChatInput from '@/components/ChatInput';
import Messages from '@/components/Messages';
import { fetchRedis } from '@/helpers/redis';
import { authOptions } from '@/lib/auth';
import { messageArrayValidationSchema } from '@/lib/validations/message';

// The following generateMetadata functiion was written after the video and is purely optional
export async function generateMetadata({
  params,
}: {
  params: { chatId: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) notFound();
  const [userId1, userId2] = params.chatId.split('--');
  const { user } = session;

  const chatPartnerId = user.id === userId1 ? userId2 : userId1;
  const chatPartnerRaw = (await fetchRedis(
    'get',
    `user:${chatPartnerId}`
  )) as string;
  const chatPartner = JSON.parse(chatPartnerRaw) as User;

  return { title: `FriendZone | ${chatPartner.name} chat` };
}

interface PageProps {
  params: {
    chatId: string;
  };
}

async function getChatMessages(chatId: string) {
  try {
    const results: string[] = await fetchRedis(
      'zrange',
      `chat:${chatId}:messages`,
      0,
      -1
    );

    const dbMessages = results.map((message) => JSON.parse(message) as Message);

    const reversedDbMessages = dbMessages.reverse();

    const messages = messageArrayValidationSchema.parse(reversedDbMessages);

    return messages;
  } catch (error) {
    notFound();
  }
}

const page = async ({ params }: PageProps) => {
  const { chatId } = params;
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const { user } = session;

  const [userId1, userId2] = chatId.split('--');

  if (user.id !== userId1 && user.id !== userId2) {
    notFound();
  }

  //? selecting the id of the user's friend
  const chatPartnerId = user.id === userId1 ? userId2 : userId1;

  const chatPartnerRaw = (await fetchRedis(
    'get',
    `user:${chatPartnerId}`
  )) as string;
  const chatPartner = JSON.parse(chatPartnerRaw) as User;
  const initialMessages = await getChatMessages(chatId);

  return (
    // <div className='flex flex-1 flex-col justify-between bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-100 to-gray-300 pb-10'>
    //   <div className='fixed top-[4rem] flex w-full justify-between border-b-2 border-gray-300 bg-sidebar-faded-black py-3  sm:items-center'>
    //     <div className='relative flex items-center space-x-4'>
    //       <div className='relative ml-4'>
    //         <div className='relative h-8 w-8 sm:h-12 sm:w-12'>
    //           <Image
    //             fill
    //             referrerPolicy='no-referrer'
    //             src={chatPartner.image}
    //             alt={`${chatPartner.name} profile picture`}
    //             className='rounded-full'
    //           />
    //         </div>
    //       </div>

    //       <div className='flex flex-col leading-tight'>
    //         <div className='flex items-center text-xl'>
    //           <span className='mr-3 font-raleway text-sm font-bold text-zinc-800'>
    //             {chatPartner.name}
    //           </span>
    //         </div>

    //         <span className='font-raleway text-sm font-medium tracking-wider text-zinc-800'>
    //           {chatPartner.email}
    //         </span>
    //       </div>
    //     </div>
    //   </div>

    //   <Messages
    //     chatId={chatId}
    //     chatPartner={chatPartner}
    //     sessionImg={session.user.image}
    //     sessionId={session.user.id}
    //     initialMessages={initialMessages}
    //   />
    //   <ChatInput chatId={chatId} chatPartner={chatPartner} />
    // </div>

    <div className='ml-5 mt-[3.5rem] flex h-full max-h-[calc(100vh-6rem)] flex-1 flex-col justify-between font-raleway md:mt-0 md:max-h-[calc(100vh-3rem)]'>
      <div className='flex justify-between border-b-2 border-gray-200 py-3 sm:items-center'>
        <div className='relative flex items-center space-x-4'>
          <div className='relative'>
            <div className='relative h-8 w-8 sm:h-12 sm:w-12'>
              <Image
                fill
                referrerPolicy='no-referrer'
                src={chatPartner.image}
                alt={`${chatPartner.name} profile picture`}
                className='rounded-full'
              />
            </div>
          </div>

          <div className='flex flex-col leading-tight'>
            <div className='flex items-center text-lg md:text-xl'>
              <span className='mr-3 font-bold  text-gray-700'>
                {chatPartner.name}
              </span>
            </div>

            <span className='text-xs text-gray-600 md:text-sm'>
              {chatPartner.email}
            </span>
          </div>
        </div>
      </div>

      <Messages
        chatId={chatId}
        chatPartner={chatPartner}
        sessionImg={session.user.image}
        sessionId={session.user.id}
        initialMessages={initialMessages}
      />
      <ChatInput chatId={chatId} chatPartner={chatPartner} />
    </div>
  );
};

export default page;
