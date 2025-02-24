'use client';

import { useState } from 'react';

export default function ProductForm() {
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState(
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione a animi ipsum voluptatem, eligendi voluptatibus maxime sit nemo ab, est esse fugiat eveniet. Neque, tenetur incidunt blanditiis ea veritatis maxime. Dolorem, ad odio. Possimus laudantium, neque suscipit cum in blanditiis error illum fuga omnis ab fugit nulla tempore quidem eius.'
  );
  const [dimensions, setDimensions] = useState('');
  const [images, setImages] = useState([]); // FileList or array of files
  const [message, setMessage] = useState('');
  const [group, setGroup] = useState('');

  // Handle file input changes
  const handleFileChange = (e) => {
    // e.target.files is a FileList, we can convert it to an array if needed
    setImages(e.target.files);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData instance to send as multipart/form-data
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('dimensions', dimensions);
    formData.append('group', group);

    // Append each image file; note that the backend expects the field name "images"
    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }

    try {
      // Send the POST request to your API route
      const res = await fetch('/api/products', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Product saved successfully!');
        // Optionally, reset the form fields after success
        setTitle('');
        setDescription('');
        setDimensions('');
        setImages([]);
        window.location.reload();
        // If you want to clear the file input, you might need a ref on the input element.
      } else {
        setMessage(data.error || 'An error occurred.');
      }
    } catch (error) {
      console.error('Error submitting the form:', error);
      setMessage('Error submitting form');
    }
  };

  return (
    <div className='flex justify-center items-center w-full h-screen'>
      <form
        onSubmit={handleSubmit}
        encType='multipart/form-data'
        className='text-black'
      >
        <div className=''>
          <label htmlFor='title'>
            Title:
            <input
              id='title'
              type='text'
              name='title'
              className='border-black border-2'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
        </div>

        <div>
          <label htmlFor='description'>
            Description:
            <textarea
              id='description'
              name='description'
              value={description}
              className='border-black border-2'
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </label>
        </div>

        <div>
          <label htmlFor='dimensions'>
            Dimensions:
            <input
              id='dimensions'
              type='text'
              name='dimensions'
              className='border-black border-2'
              value={dimensions}
              onChange={(e) => setDimensions(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label htmlFor='group'>
            Group:
            <input
              id='group'
              type='text'
              name='group'
              className='border-black border-2'
              value={group}
              onChange={(e) => setGroup(e.target.value)}
            />
          </label>
        </div>

        <div>
          <label htmlFor='images'>
            Images:
            <input
              id='images'
              type='file'
              name='images'
              multiple
              onChange={handleFileChange}
              required
            />
          </label>
        </div>

        <button type='submit'>Create Product</button>

        {message && <p>{message}</p>}
      </form>
    </div>
  );
}
