import express from 'express';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import db from '../../../models/index.js'; // Sequelize models

const router = express.Router();

router.post('/retrain-model', async (req, res) => {
  try {
    const transactions = await db.Transaction.findAll({
      where: { category_corrected: true }
    });

    const dataPath = path.resolve('retrain', 'training_data.csv');
    fs.mkdirSync(path.dirname(dataPath), { recursive: true });

    const csvData = ['name,amount,category']; // header
    transactions.forEach(tx => {
      const name = `"${tx.name.replace(/"/g, '')}"`; // basic sanitization
      csvData.push(`${name},${tx.amount},${tx.category}`);
    });
    fs.writeFileSync(dataPath, csvData.join('\n'));

    exec('python3 ml/retrain_model.py', (err, stdout, stderr) => {
      if (err) {
        console.error(stderr);
        return res.status(500).json({ message: 'Retraining failed', error: stderr });
      }
      return res.json({ message: 'Model retrained successfully', output: stdout });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
