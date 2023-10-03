"use client";
import { FC } from "react";

interface pageProps {}

const HeroBg: FC<pageProps> = ({}) => {
  return (
    <div className="absolute h-full w-full top-0 left-0">
      <div className="-z-[3] absolute h-[400px] w-[400px] bg-[#58E6CC] -top-[20%] -left-[10%] rounded-full"></div>
      <div className="-z-[3] absolute h-[120px] w-[120px] bg-[#FFA665] top-10 left-[50%]"></div>
      <div className="-z-[3] absolute h-[360px] w-[360px] bg-[#5891E6] bottom-0 -right-5"></div>
      <div className="-z-[3] absolute h-[380px] w-[380px] bg-[#C08AF6] -top-20 -right-10 rounded-full"></div>
      <div className="-z-[3] absolute h-[240px] w-[240px] bg-[#F2627C] top-20 left-[30%]"></div>
      <div className="-z-[3] absolute bottom-0 left-0 h-[400px] w-[150px] bg-[#F2627C]"></div>
      <div className="-z-[3] absolute h-[240px] w-[240px] rounded-full bottom-[20%] left-[15%] bg-[#FFA665]"></div>
      <div className="-z-[3] absolute "></div>
      <div className="backdrop-blur blur-[500px] -z-[2] absolute h-full w-full bg-faded-white"></div>
    </div>
  );
};

export default HeroBg;
