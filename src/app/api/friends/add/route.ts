import { getServerSession } from 'next-auth';
import { z } from 'zod';

import { fetchRedis } from '@/helpers/redis';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { pusherServer } from '@/lib/pusher';
import { toPusherKey } from '@/lib/utils';
import { addFriendValidator } from '@/lib/validations/add-friend';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email: emailToAdd } = addFriendValidator.parse(body.email);

    // const RESTResponse = await fetch(
    //   `${process.env.UPSTASH_REDIS_REST_URL}/get/user:email${emailToAdd}`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
    //     },
    //     cache: "no-store",
    //   }
    // );

    // const data = (await RESTResponse.json()) as { result: string | null };

    // const userIdToAdd = data.result;

    const userIdToAdd = (await fetchRedis(
      'get',
      `user:email:${emailToAdd}`
    )) as string;

    if (!userIdToAdd) {
      return new Response('User not found!', { status: 400 });
    }

    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response('Unauthorized!', { status: 401 });
    }
    if (userIdToAdd === session.user.id) {
      return new Response('You cannot add yourself. <3', { status: 400 });
    }

    //If the user is already sent a friend request

    const isAlreadySentRequest = (await fetchRedis(
      'sismember',
      `user:${userIdToAdd}:incoming_friend_requests`,
      session.user.id
    )) as 0 | 1;

    if (isAlreadySentRequest) {
      return new Response('Relax! Your request has already been sent.', {
        status: 400,
      });
    }

    //If they are already Friends

    const isAlreadyFriends = (await fetchRedis(
      'sismember',
      `user:${session.user.id}:friends`,
      userIdToAdd
    )) as 0 | 1;

    if (isAlreadyFriends) {
      return new Response('You are already friends', {
        status: 400,
      });
    }

    //? Pusher notification for valid Friend Request
    pusherServer.trigger(
      toPusherKey(`user:${userIdToAdd}:incoming_friend_requests`),
      'incoming_friend_requests',
      {
        senderId: session.user.id,
        senderEmail: session.user.email,
      }
    );

    //? sending friend request
    db.sadd(`user:${userIdToAdd}:incoming_friend_requests`, session.user.id);
    return new Response('Friend request sent!', { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid request payload', { status: 422 });
    }

    return new Response('Something went wrong', { status: 400 });
  }
}
