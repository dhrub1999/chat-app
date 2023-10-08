'use client';
import { FC, useRef } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';

interface LottiePlayerProps {
  src: string;
}

const LottiePlayer: FC<LottiePlayerProps> = ({ src }) => {
  const playerRef = useRef(null);

  return (
    <Player
      ref={playerRef}
      autoplay={true}
      loop={true}
      src={src}
      speed={0.5}
      className='w-full max-w-[320px] lg:max-w-[400px]'
    />
  );
};

export default LottiePlayer;
