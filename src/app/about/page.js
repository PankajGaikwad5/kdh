import React from 'react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';

const page = () => {
  return (
    <div className=''>
      <Navbar />
      <main className='pt-16'>
        <h1
          className={`text-3xl border-b-4 border-pink-400 pb-4 px-8 tracking-wider mb-8 font-semibold uppercase `}
        >
          about
        </h1>
        <div className='p-2 md:p-8 flex justify-center'>
          <Card
            img={'/assets/profile.jpg'}
            imagePosition={'left'}
            title={'Karan Desai'}
            desc={
              'Award Winning Architecture + Interior Design Studio | TedX Speaker'
            }
            // text={``}
          />
        </div>
      </main>
    </div>
  );
};

export default page;
