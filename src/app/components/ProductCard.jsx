'use client';
import Image from 'next/image';
import { CardBody, CardContainer, CardItem } from '../../components/ui/3d-card';
import { useRouter } from 'next/navigation';

const ProductCard = ({ title, img }) => {
  const router = useRouter();
  const navigateTo = () => {
    router.push('/productdetails');
  };
  return (
    <div onClick={() => navigateTo()} className=''>
      <CardContainer className='p-0 cursor-pointer'>
        <CardBody className='bg-gray-200/40 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full md:w-[22rem] h-auto rounded-xl p-4 md:p-6 border '>
          <CardItem
            translateZ='50'
            className='text-xl font-bold text-neutral-600 dark:text-white'
          >
            {title}
          </CardItem>
          {/* <CardItem
              as='p'
              translateZ='60'
              className='text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300'
            >
              Hover over this card to unleash the power of CSS perspective
            </CardItem> */}
          <CardItem
            translateZ='200'
            rotateX={20}
            rotateZ={-10}
            className='w-full mt-4'
          >
            <div className='w-full aspect-[4/3] relative'>
              <Image
                src={img}
                height='1000'
                width='1000'
                className=' object-cover rounded group-hover/card:shadow-xl'
                alt='thumbnail'
              />
            </div>
          </CardItem>
          <div className='flex justify-between items-center'>
            <CardItem
              translateZ={20}
              translateX={-40}
              as='button'
              className='px-4 py-2 m-0 rounded-xl text-xs font-normal dark:text-white'
            >
              <a href='/about'>Details →</a>
            </CardItem>
            {/* <CardItem
                translateZ={20}
                translateX={40}
                as='button'
                className='px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold'
              >
                Sign up
              </CardItem> */}
          </div>
        </CardBody>
      </CardContainer>
    </div>
  );
};

export default ProductCard;
