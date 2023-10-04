import { FC } from "react";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Button from "@/components/ui/Button";
import HeroBg from "@/components/ui/HeroBg";

const page = async ({}) => {
  const session = await getServerSession(authOptions);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <HeroBg />
    </section>
  );
};

export default page;
