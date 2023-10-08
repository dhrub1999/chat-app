import { Icon, Icons } from "@/components/Icons";
import SignOutButton from "@/components/SignOutButton";
import UserFriendRequestInSidebar from "@/components/UserFriendRequestInSidebar";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FC, ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

interface UserOptions {
  id: number;
  name: string;
  href: string;
  Icon: Icon;
}

const userOptions: UserOptions[] = [
  {
    id: 1,
    name: "Add friend",
    href: "/dashboard/add",
    Icon: "UserPlus",
  },
];

const Layout = async ({ children }: LayoutProps) => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  //? This fn will return the number of friend requests the authenticated user has

  const friendReqCount = (
    (await fetchRedis(
      "smembers",
      `user:${session.user.id}:incoming_friend_requests`
    )) as User[]
  ).length;

  return (
    <div className="w-full flex h-screen">
      <div className="h-full w-full flex max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
        <Link
          href="/dashboard"
          className="flex gap-x-2 h-16 shrink-0 items-center"
        >
          <Icons.Logo className="h-12 w-auto fill-indigo-600" />
          <p className="font-vanillaCream text-2xl text-zinc-800">Qualk</p>
        </Link>

        <div className="text-xs font-raleway font-semibold leading-6 text-gray-400">
          Your chats
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li className="font-raleway">
              {/* //? User's chats here */}
              User's chats will be displayed here!!
            </li>
            <li>
              <div className="text-xs font-semibold leading-6 text-gray-400">
                Overview
              </div>

              <ul role="list" className="-mx-2 mt-2 space-y-1">
                {userOptions.map((option) => {
                  console.log(typeof option.id);
                  const Icon = Icons[option.Icon];
                  return (
                    <li key={option.id}>
                      <Link
                        href={option.href}
                        className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors duration-200 ease-in"
                      >
                        <span className="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.72rem] font-medium bg-white transition-colors duration-200 ease-in">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="truncate">{option.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>

            {/* //? User's Friend requests will show up here */}

            <li>
              <UserFriendRequestInSidebar
                userFriendRequestCount={friendReqCount}
                sessionId={session.user.id}
              />
            </li>

            <li className=" mt-auto flex items-center">
              <div className="flex flex-1 items-center gap-x-4 py-3 text-sm font-semibold leading-6 text-gray-900">
                <div className="relative h-8 w-8 bg-gray-50">
                  <Image
                    fill
                    referrerPolicy="no-referrer"
                    className="rounded-full"
                    src={session.user.image || ""}
                    alt="Your profile picture"
                  />
                </div>

                {/* //? "sr-only" stands for "screen reader only, its a bunch of css properties for the people who are using screen readers." */}

                <span className="sr-only">Your profile</span>
                <div className="flex flex-col">
                  <span aria-hidden="true">{session.user.name}</span>
                  <span className="text-xs text-zinc-400" aria-hidden="true">
                    {session.user.email}
                  </span>
                </div>
              </div>

              <SignOutButton className="h-full aspect-square" />
            </li>
          </ul>
        </nav>
      </div>
      {children}
    </div>
  );
};

export default Layout;
