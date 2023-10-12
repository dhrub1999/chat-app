import { fetchRedis } from '@/helpers/redis';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { nanoid } from 'nanoid';
import {
  Message,
  singleMessageValidatingSchema,
} from '@/lib/validations/message';
import { pusherServer } from '@/lib/pusher';
import { toPusherKey } from '@/lib/utils';

export async function POST(req: Request) {
  try {
    const { text, chatId }: { text: string; chatId: string } = await req.json();
    const session = await getServerSession(authOptions);

    if (!session) return new Response('Unauthorize', { status: 401 });

    const [userId1, userId2] = chatId.split('--');
    if (session.user.id !== userId1 && session.user.id !== userId2) {
      return new Response('Unauthorized', { status: 401 });
    }

    //?Finding out the receiver's id
    const receiverId = session.user.id === userId1 ? userId2 : userId1;

    //? Checking if the sender and the receiver are even friends or not by pulling out the friendlist and matching the receiverId
    const friendList = (await fetchRedis(
      'smembers',
      `user:${session.user.id}:friends`
    )) as string[];

    const isFriends = friendList.includes(receiverId);

    if (!isFriends) {
      return new Response('Unauthorized', { status: 401 });
    }

    const rawSender = (await fetchRedis(
      'get',
      `user:${session.user.id}`
    )) as string;
    const sender = JSON.parse(rawSender) as User;

    //?  Validations of message

    const timestamp = Date.now();

    const messageData: Message = {
      id: nanoid(), //? Its a lightweight package to generate ids
      senderId: session.user.id,
      text,
      timestamp,
    };

    //? Sending message to the db
    const message = singleMessageValidatingSchema.parse(messageData);

    //? Notify all connected chats
    pusherServer.trigger(
      toPusherKey(`chat:${chatId}`),
      'incoming-message',
      message
    );

    await db.zadd(`chat:${chatId}:messages`, {
      score: timestamp,
      member: JSON.stringify(message),
    });

    return new Response('Ok');
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }

    return new Response('Internal Server Error', { status: 500 });
  }
}
