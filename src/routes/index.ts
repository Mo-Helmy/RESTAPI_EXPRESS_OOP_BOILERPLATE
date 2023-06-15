import express from 'express';
import productRoutes from './api/product.routes';
import userRoutes from './api/user.routes';

const apiRoutes = express.Router();

apiRoutes.use('/products', productRoutes);
apiRoutes.use('/users', userRoutes);

apiRoutes.get('/', (req, res) => {
  res.status(200).json({ message: 'Godzilla Backend' });
});

export default apiRoutes;
