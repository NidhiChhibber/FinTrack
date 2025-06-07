import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const scriptPath = path.join(__dirname, "../ml/predict_category.py");


export async function categorizeTransaction(text) {
  return new Promise((resolve) => {
    exec(`python3 "${scriptPath}" "${text}"`, (err, stdout, stderr) => {
      if (err || !stdout) {
        console.error(`Prediction failed for "${text}":`, stderr);
        return resolve("Uncategorized");
      }
      resolve(stdout.trim());
    });
  });
}
