const getTopicById = async (id) => {
  try {
    const res = await fetch(`/api/products/${id}`, {
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
  const { id } = params;
  const data = await getTopicById(id);
  const { title, images, dimensions } = data.products;
  return data;
};
