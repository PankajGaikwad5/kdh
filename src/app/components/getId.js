const getTopicById = async (id) => {
  try {
    const res = await fetch(`https://kdh.vercel.app/api/products/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch topic');
    }

    return res.json();
  } catch (error) {
    console.log(error);
  }
};

export default async ({ params }) => {
  console.log(params);
  const { id } = params;
  const data = await getTopicById(id);
  console.log(data);
  const { title, images, dimensions } = data.products;
  return data;
};
