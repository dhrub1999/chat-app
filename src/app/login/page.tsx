"use client";
import { FC } from "react";
import HeroBg from "@/components/ui/HeroBg";

interface pageProps {}

const LogIn: FC<pageProps> = ({}) => {
  return (
    <>
      <section className="relative h-screen w-full overflow-hidden">
        <HeroBg />
        <div>
          <div>
            <h1 className="font-raleway font-black text-6xl leading-[3.5rem]">
              Greet, Gather, & Gossip! Your chat corner of the web.
            </h1>
          </div>
        </div>
      </section>
    </>
  );
};

export default LogIn;
