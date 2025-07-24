const express = require('express');
const multer = require('multer');
const path = require('path');
const Product = require('../../models/ProductSchema');

const router = express.Router();

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// POST a product
router.post('/', upload.single('image'), async (req, res) => {
  try { 
    const { name, price, category, description, stock } = req.body;
    if (!name || !price || !category) {
      return res.status(400).json({ message: 'Name, price, and category are required' });
    }

    const product = new Product({
      name,
      price,
      category,
      description: description || '',
      stock: stock || 0,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await product.save();
    
    // ✅ Ensure JSON response is sent
    return res.status(201).json({ success: true, message: 'Product added successfully', product });

  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET all products
// ✅ GET all products or filter by category
router.get('/', async (req, res) => {
  try {
    const category = req.query.category;
    const filter = category ? { category: { $regex: new RegExp(category, 'i') } } : {};

    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});



// GET by ID
router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json(product);
});

// PUT update product
router.put('/:id', upload.single('image'), async (req, res) => {
  const updateData = { ...req.body };
  if (req.file) updateData.imageUrl = `/uploads/${req.file.filename}`;

  const updated = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
  res.json(updated);
});

// DELETE a product
router.delete('/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product deleted' });
});

module.exports = router;
