import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'cart.db');
const db = new sqlite3.Database(dbPath);

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Database
db.serialize(() => {
  // Products table
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      description TEXT,
      image TEXT
    )
  `);

  // Cart table
  db.run(`
    CREATE TABLE IF NOT EXISTS cart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      FOREIGN KEY(product_id) REFERENCES products(id)
    )
  `);

  // Seed Products if empty
  db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
    if (row && row.count === 0) {
      const stmt = db.prepare("INSERT INTO products (name, price, description, image) VALUES (?, ?, ?, ?)");
      stmt.run("Premium Yoga Mat", 49.99, "Eco-friendly, non-slip natural rubber yoga mat.", "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=500");
      stmt.run("Cork Yoga Block", 14.99, "High-density natural cork block for posture support.", "https://images.unsplash.com/photo-1600881333168-2ef49b341f30?w=500");
      stmt.run("Organic Cotton Strap", 9.99, "Durable 8ft alignment strap with metal D-ring.", "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500");
      stmt.run("Meditation Cushion", 39.99, "Buckwheat-filled ergonomic cushion for mindfulness.", "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=500");
      stmt.finalize();
      console.log("Seeded database with yoga products.");
    }
  });
});

// API Routes
app.get('/api/products', (req, res) => {
  db.all("SELECT * FROM products", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/cart', (req, res) => {
  const query = `
    SELECT cart.id, cart.quantity, products.id as product_id, products.name, products.price, products.image
    FROM cart
    JOIN products ON cart.product_id = products.id
  `;
  db.all(query, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/cart', (req, res) => {
  const { product_id, quantity = 1 } = req.body;
  if (!product_id) return res.status(400).json({ error: "product_id is required" });

  db.get("SELECT * FROM cart WHERE product_id = ?", [product_id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });

    if (row) {
      // Update quantity
      const newQty = row.quantity + quantity;
      db.run("UPDATE cart SET quantity = ? WHERE product_id = ?", [newQty, product_id], (err2) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json({ message: "Cart updated", product_id, quantity: newQty });
      });
    } else {
      // Insert new item
      db.run("INSERT INTO cart (product_id, quantity) VALUES (?, ?)", [product_id, quantity], (err2) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json({ message: "Added to cart", product_id, quantity });
      });
    }
  });
});

app.delete('/api/cart/:id', (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM cart WHERE id = ?", [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Item not found in cart" });

    if (row.quantity > 1) {
      db.run("UPDATE cart SET quantity = quantity - 1 WHERE id = ?", [id], (err2) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json({ message: "Decremented quantity" });
      });
    } else {
      db.run("DELETE FROM cart WHERE id = ?", [id], (err2) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json({ message: "Removed from cart" });
      });
    }
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
