import { useParams } from 'react-router-dom';

const Product = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen p-10">
      <h1 className="text-3xl font-bold">Product Details</h1>
      <p>Product ID: {id}</p>
    </div>
  );
};

export default Product;
