import { FC } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface loadingPageProps {}

const loading: FC<loadingPageProps> = ({}) => {
  return (
    <div className='flex w-full flex-col items-center justify-center gap-3'>
      <div className='flex h-96 w-full max-w-[600px] flex-col items-center justify-center bg-gray-50 px-3 py-6 shadow-lg'>
        <Skeleton className='mb-4' height={60} width={500} />
        <Skeleton height={50} width={400} />
        <Skeleton height={30} width={400} />
      </div>
    </div>
  );
};

export default loading;
