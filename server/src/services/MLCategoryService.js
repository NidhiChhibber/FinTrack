// server/src/services/MLCategoryService.js - Production version
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class MLCategoryService {
  constructor() {
    this.modelPath = path.join(__dirname, '..', '..', 'ml');
    this.isModelReady = false;
    this.checkModelHealth();
  }

  /**
   * Check if ML model is ready
   */
  async checkModelHealth() {
    try {
      const result = await this._callMLService('test health check', '');
      this.isModelReady = !result.error;
      console.log('ML Model Health:', this.isModelReady ? 'Ready' : 'Not Ready');
      if (result.error) {
        console.log('ML Error:', result.error);
      }
    } catch (error) {
      this.isModelReady = false;
      console.log('ML Model Health: Error -', error.message);
    }
  }

  /**
   * Predict category for a transaction
   */
  async predictCategory(transactionName, merchantName = '') {
    if (!this.isModelReady) {
      console.warn('ML model not ready, using fallback');
      return {
        category: 'Uncategorized',
        confidence: 0.1,
        source: 'ai',
        error: 'Model not ready'
      };
    }

    try {
      const result = await this._callMLService(transactionName, merchantName);
      
      if (result.error) {
        console.error('ML prediction error:', result.error);
        return {
          category: 'Uncategorized',
          confidence: 0.1,
          source: 'ai',
          error: result.error
        };
      }

      // Use actual confidence from Python, round to 3 decimal places
      const confidence = result.confidence ? Math.round(result.confidence * 1000) / 1000 : 0.5;

      return {
        category: result.category || 'Uncategorized',
        confidence: confidence,
        source: 'ai'
      };

    } catch (error) {
      console.error('ML service error:', error);
      return {
        category: 'Uncategorized',
        confidence: 0.1,
        source: 'ai',
        error: error.message
      };
    }
  }

  /**
   * Call the Python ML service
   * @private
   */
  _callMLService(transactionName, merchantName = '') {
    return new Promise((resolve, reject) => {
      const pythonScript = path.join(this.modelPath, 'category_predictor.py');
      const args = [pythonScript, transactionName];
      
      if (merchantName) {
        args.push(merchantName);
      }
      
      const python = spawn('python3', args, {
        cwd: this.modelPath,
        stdio: ['pipe', 'pipe', 'pipe']
      });
      
      let output = '';
      let error = '';

      python.stdout.on('data', (data) => {
        output += data.toString();
      });

      python.stderr.on('data', (data) => {
        error += data.toString();
      });

      python.on('close', (code) => {
        if (code === 0) {
          try {
            const result = JSON.parse(output.trim());
            console.log('ML Raw Result:', result); // Debug logging
            resolve(result);
          } catch (parseError) {
            console.log('ML Parse Error, raw output:', output); // Debug logging
            // Fallback for non-JSON output
            resolve({
              category: output.trim() || 'Uncategorized',
              confidence: 0.6
            });
          }
        } else {
          reject(new Error(`Python process failed with code ${code}: ${error}`));
        }
      });

      python.on('error', (err) => {
        reject(new Error(`Failed to spawn Python process: ${err.message}`));
      });

      // Set timeout to prevent hanging
      setTimeout(() => {
        python.kill();
        reject(new Error('ML prediction timeout'));
      }, 10000); // 10 second timeout
    });
  }

  /**
   * Test the ML service
   */
  async testService() {
    const testCases = [
      { name: 'STARBUCKS COFFEE', merchant: 'Starbucks' },
      { name: 'WALMART SUPERCENTER', merchant: '' },
      { name: 'SHELL GAS STATION', merchant: 'Shell' }
    ];

    console.log('\n=== Testing ML Service ===');
    
    for (const test of testCases) {
      try {
        const result = await this.predictCategory(test.name, test.merchant);
        console.log(`${test.name}: ${result.category} (${result.confidence})`);
      } catch (error) {
        console.log(`${test.name}: ERROR - ${error.message}`);
      }
    }
  }

  /**
   * Force refresh model health check
   */
  async refreshModelHealth() {
    await this.checkModelHealth();
    return this.isModelReady;
  }
}