import { FC } from 'react';
import AddFriendButton from '@/components/AddFriendButtonn';

const page: FC = () => {
  return (
    <main className='grid h-full w-full place-content-center place-items-center overflow-hidden '>
      <section className='z-10 rounded-md bg-faded-white px-8 py-16 text-center shadow-md backdrop-blur-[120px] md:px-10 md:py-20 lg:rounded-lg lg:px-12 lg:py-24'>
        <h3 className='mb-2 font-vanillaCream text-3xl text-gray-900'>
          Add a friend
        </h3>
        <p className='mb-6 font-raleway text-slate-700'>
          Connect with those people you care about.
        </p>
        <AddFriendButton />
      </section>
    </main>
  );
};

export default page;
