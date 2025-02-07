// 'use client';
// import Image from 'next/image';
// import { CardBody, CardContainer, CardItem } from '../../components/ui/3d-card';
// import { useRouter } from 'next/navigation';

// const ProductCard = ({ title, img }) => {
//   const router = useRouter();
//   const navigateTo = () => {
//     router.push('/productdetails');
//   };
//   return (
//     <div
//       onClick={() => navigateTo()}
//       className='cursor-pointer transform transition duration-300 hover:scale-105 '
//     >
//       <CardContainer className='p-0 cursor-pointer'>
//         <CardBody className='bg-gray-200/40 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full md:w-[22rem] h-auto rounded-xl p-4 md:p-6 border '>
//           <CardItem
//             translateZ='50'
//             // className='text-xl font-bold text-neutral-600 dark:text-white'
//             className='text-xl font-semibold text-gray-800 dark:text-gray-100'
//           >
//             {title}
//           </CardItem>
//           {/* <CardItem
//               as='p'
//               translateZ='60'
//               className='text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300'
//             >
//               Hover over this card to unleash the power of CSS perspective
//             </CardItem> */}
//           {/* <CardItem
//             translateZ='200'
//             rotateX={20}
//             rotateZ={-10}
//             className='w-full mt-4'
//           >
//             <div className='w-full aspect-[4/3] relative'>
//               <Image
//                 src={img}
//                 height='1000'
//                 width='1000'
//                 className=' object-cover rounded group-hover/card:shadow-xl'
//                 alt='thumbnail'
//               />
//             </div>
//           </CardItem> */}
//           <CardItem
//             translateZ='200'
//             rotateX={20}
//             rotateZ={-10}
//             className='w-full mt-4'
//           >
//             <div className='w-full aspect-[4/3] relative rounded'>
//               <Image
//                 src={img}
//                 // layout='fill'
//                 height='1000'
//                 width='1000'
//                 objectFit='cover'
//                 className='transition-transform duration-300 group-hover:scale-105'
//                 alt='thumbnail'
//               />
//             </div>
//           </CardItem>

//           <div className='flex justify-between items-center'>
//             <CardItem
//               translateZ={20}
//               translateX={-40}
//               as='button'
//               className='px-4 py-2 text-xs font-normal text-white bg-pink-500 rounded hover:bg-pink-600 transition-colors'
//             >
//               <a href='/about'>Details →</a>
//             </CardItem>
//             {/* <CardItem
//                 translateZ={20}
//                 translateX={40}
//                 as='button'
//                 className='px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold'
//               >
//                 Sign up
//               </CardItem> */}
//           </div>
//         </CardBody>
//       </CardContainer>
//     </div>
//   );
// };

// export default ProductCard;

// 'use client';
// import Image from 'next/image';
// import { CardBody, CardContainer, CardItem } from '../../components/ui/3d-card';
// import { useRouter } from 'next/navigation';

// const ProductCard = ({ title, img }) => {
//   const router = useRouter();

//   const navigateTo = () => {
//     router.push('/productdetails');
//   };

//   return (
//     <div
//       onClick={navigateTo}
//       className='cursor-pointer transform transition duration-300 hover:scale-105'
//     >
//       <CardContainer className='p-0'>
//         <CardBody className='bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition duration-300'>
//           <CardItem
//             translateZ='50'
//             className='text-xl font-semibold text-gray-800 dark:text-gray-100'
//           >
//             {title}
//           </CardItem>
//           <CardItem
//             translateZ='200'
//             rotateX={20}
//             rotateZ={-10}
//             className='w-full mt-4'
//           >
//             <div className='w-full aspect-[4/3] relative '>
//               <Image
//                 src={img}
//                 // layout='fill'
//                 width='1000'
//                 height='1000'
//                 objectFit='cover'
//                 className='transition-transform rounded duration-300 group-hover:scale-105'
//                 alt='thumbnail'
//               />
//             </div>
//           </CardItem>
//           <div className='flex justify-between items-center mt-4'>
//             <CardItem
//               translateZ={20}
//               translateX={-40}
//               as='button'
//               className='px-4 py-2 text-xs font-normal text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors'
//             >
//               Details →
//             </CardItem>
//           </div>
//         </CardBody>
//       </CardContainer>
//     </div>
//   );
// };

// export default ProductCard;

// ProductCard component
'use client';
import Image from 'next/image';
import { CardBody, CardContainer, CardItem } from '../../components/ui/3d-card';
// import { useRouter } from 'next/navigation';

const ProductCard = ({ title, img }) => {
  // const router = useRouter();

  const navigateTo = () => {
    window.location.href = '/productdetails';
  };

  return (
    <div
      onClick={navigateTo}
      className='cursor-pointer transform transition duration-300 hover:scale-[1.02]'
    >
      <CardContainer className='p-0'>
        <CardBody className='bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-shadow duration-300'>
          <CardItem
            translateZ='200'
            rotateX={20}
            rotateZ={-10}
            className='w-full mt-4'
          >
            <div className='w-full aspect-[4/3] relative overflow-hidden flex justify-center items-center rounded-lg'>
              <Image
                src={img}
                // fill
                width='1000'
                height='1000'
                // sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                className='object-cover transition-transform duration-300 rounded hover:scale-105'
                alt={title}
              />
            </div>
          </CardItem>

          <div className='mt-4 space-y-2 flex justify-between items-center'>
            <h3 className='text-lg font-semibold text-gray-800 dark:text-gray-100 truncate'>
              {title}
            </h3>
            <div className='flex justify-between items-center'>
              {/* <span className='text-gray-500 dark:text-gray-400 text-sm'>
                Starting from
                <span className='ml-1 text-blue-600 dark:text-blue-400 font-medium'>
                  $299
                </span>
              </span> */}
              <button className='px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200'>
                View Details
              </button>
            </div>
          </div>
        </CardBody>
      </CardContainer>
    </div>
  );
};

export default ProductCard;
