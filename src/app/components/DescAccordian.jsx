'use client';
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '../components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/ui/form';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Poppins, Montserrat } from 'next/font/google';

// popins
// montserrat
const popins = Poppins({
  subsets: ['latin'], // Specify subsets
  weight: ['100', '200', '300', '400', '600', '700'], // Specify weight
});
const montserrat = Montserrat({
  subsets: ['latin'], // Specify subsets
  weight: ['400', '600', '700'], // Specify weight
});

const formSchema = z.object({
  name: z
    .string()
    .min(2, 'name must be at least 2 characters')
    .max(50, 'name must be at most 50 characters'),
  email: z.string().email('Invalid email address').min(2).max(50),
  message: z.string(),
});

const DescAccordian = ({ scrollPosition, desc, title, dimensions }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  async function onSubmit(values) {
    // Do something with the form values.
    // console.log(values);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values,
        }),
      });

      if (response.ok) {
        alert('Message sent successfully!');
        // Refresh the page
        window.location.reload();
      } else {
        alert('Failed to send the message. Please try again.');
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleDownload = async (event) => {
    event.preventDefault();
    const fileUrl =
      'https://7h4qznnnsa.ufs.sh/f/8EYZaNz64oKUQsSTArCgpKiS14YXmU2JDcwG0vBsCL6dWNyP';

    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', 'file.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up blob URL
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div
      className='flex flex-col md:flex-row gap-4 w-full bg-zinc-100/50  text-zinc-700 py-8'
      // style={{
      //   transform: `translateY(${scrollPosition * 0.1}px)`, // Simple parallax effect
      //   transition: 'transform 0.1s ease-out',
      // }}
    >
      <div className='flex flex-col md:w-1/2 px-6 md:px-16'>
        <h1 className='uppercase font-bold my-4 text-2xl'>{title}</h1>
        <h1 className='uppercase text-zinc-500 font-semibold my-4 text-xl'>
          description
        </h1>
        <p className='font-semibold '>{desc}</p>
      </div>
      <div className='flex flex-col mt-10  md:w-1/2 px-6 md:px-16'>
        <Accordion type='single' collapsible className='space-y-4'>
          <AccordionItem
            value='item-1'
            className='border-y-[1px] border-zinc-600 py-1'
          >
            <AccordionTrigger className='text-zinc-800 uppercase font-semibold'>
              Technical information
            </AccordionTrigger>
            <AccordionContent>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos nisi
              ab ut in libero assumenda ad optio commodi. Quibusdam voluptate,
              illum ipsum earum, commodi consectetur dicta sed, quisquam facere
              beatae provident doloribus? Harum assumenda, quia cum rem fugit
              deleniti eaque recusandae esse accusantium quidem. Aliquid
              similique dolorem quibusdam beatae earum.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value='item-2'
            className='border-y-[1px] border-zinc-600 py-1'
          >
            <AccordionTrigger className='text-zinc-800 uppercase font-semibold'>
              Dimensions
            </AccordionTrigger>
            <AccordionContent>{dimensions}</AccordionContent>
          </AccordionItem>
          <AccordionItem
            value='item-3'
            className='border-y-[1px] border-zinc-600 py-1'
          >
            <AccordionTrigger className='text-zinc-800 uppercase font-semibold'>
              download pdf
            </AccordionTrigger>
            <AccordionContent>
              {/* <a
                href='https://7h4qznnnsa.ufs.sh/f/8EYZaNz64oKUQsSTArCgpKiS14YXmU2JDcwG0vBsCL6dWNyP'
                download='filename.pdf'
              >
                click here to start download
              </a> */}
              <a href='#' onClick={handleDownload}>
                Download PDF
              </a>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value='item-4'
            className='border-y-[1px] border-zinc-600 py-1'
          >
            <AccordionTrigger className='text-zinc-800 uppercase font-semibold'>
              3d model
            </AccordionTrigger>
            <AccordionContent>
              <Form {...form}>
                <form
                  // action='https://getform.io/f/bjjjprgb'
                  // method='POST'
                  className={`space-y-4 px-4 ${popins.className}`}
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <h1 className='font-semibold uppercase'>
                    Email us to get the 3d model sent to your email
                  </h1>
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            className='text-black'
                            placeholder='Enter your name'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            className='text-black'
                            placeholder='Enter your email'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='message'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message(optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder='Enter your message'
                            className='input textarea text-black'
                            rows={5}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type='submit'
                    className='bg-white uppercase text-gray-900 hover:bg-black hover:text-gray-300 transition-all duration-500 ease-in-out rounded-full px-5 tracking-normal font-medium'
                  >
                    Submit
                  </Button>
                </form>
              </Form>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default DescAccordian;
