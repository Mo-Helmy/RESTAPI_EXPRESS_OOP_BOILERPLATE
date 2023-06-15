import express from 'express';
import ProductHandler from '../../handlers/product.handler';

const productRoutes = express.Router();
const productHandler = new ProductHandler();

productRoutes.get('', (req, res) => productHandler.list(req, res));

productRoutes.post('', (req, res) => productHandler.create(req, res));

productRoutes.get('/:id', (req, res) => productHandler.retrive(req, res));

productRoutes.put('/:id', (req, res) => productHandler.update(req, res));

productRoutes.patch('/:id', (req, res) => productHandler.partialUpdate(req, res));

productRoutes.delete('/:id', (req, res) => productHandler.delete(req, res));

export default productRoutes;
