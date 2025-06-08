// server/src/controllers/MLController.js - Simple version
import { MLCategoryService } from '../services/MLCategoryService.js';

export class MLController {
  constructor() {
    this.mlService = new MLCategoryService();
  }

  /**
   * Predict category for a transaction description
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   */
  predictCategory = async (req, res) => {
    try {
      const { description, merchantName } = req.body;

      if (!description) {
        return res.status(400).json({
          success: false,
          error: 'Transaction description is required'
        });
      }

      const prediction = await this.mlService.predictCategory(description, merchantName);

      res.json({
        success: true,
        data: prediction
      });
    } catch (error) {
      console.error('Category prediction failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to predict category'
      });
    }
  };
}