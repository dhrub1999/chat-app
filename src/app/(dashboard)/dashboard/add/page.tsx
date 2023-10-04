import { FC } from "react";
import AddFriendButton from "@/components/AddFriendButtonn";
import HeroBg from "@/components/ui/HeroBg";

const page: FC = () => {
  return (
    <main className="relative h-screen w-full overflow-hidden grid place-content-center place-items-center ">
      <HeroBg />
      <div className="h-[200px] w-[200px] rounded-full bg-[#FFA665] absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] -z-[2]"></div>

      <section className="text-center relative container py-16 md:py-20 lg:py-24 px-8 md:px-10 lg:px-12 bg-faded-white backdrop-blur-[120px] shadow-md rounded-md lg:rounded-lg">
        <h3 className="text-3xl font-vanillaCream text-gray-900 mb-2">
          Add a friend
        </h3>
        <p className="mb-6 font-raleway text-slate-700">
          Connect with those people you care about.
        </p>
        <AddFriendButton />
      </section>
    </main>
  );
};

export default page;
