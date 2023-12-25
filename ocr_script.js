import vision from '@google-cloud/vision';
import sharp from 'sharp';
import fs from 'fs';
import extraction from './extraction.js';

const CREDENTIALS = {
  //Google API key credetials
}
;

const CONFIG = {
    credentials: {
        private_key: CREDENTIALS.private_key,
        client_email: CREDENTIALS.client_email
    }
};

const client = new vision.ImageAnnotatorClient(CONFIG);

const detectText = async (file_path, output) => {
    // Load the image using sharp
    const imageBuffer = await sharp(file_path)
    // Resize the image (optional, adjust as needed)
    .resize({ width: 800 })
    .gamma(1.2)
    // Convert the image to grayscale (optional, may improve text extraction)
    .grayscale() 
    // Sharpen the image
    .sharpen({ sigma: 1, flat: 1, jagged: 0.1 })
    // Apply other preprocessing steps as needed
    .toBuffer();

    console.log("sharpening")

    let [result] = await client.textDetection(file_path);
    console.log(result.fullTextAnnotation.text);

    console.log("annotations done");

    fs.writeFileSync('output.txt', result.fullTextAnnotation.text);

    console.log("writing on output.txt");

    const out = await extraction(result.fullTextAnnotation.text);

    console.log(out);

    return out;

};

// detectText('41.jpg');

// import './extraction.js';
// import { builtinModules } from 'module';

export default detectText;
