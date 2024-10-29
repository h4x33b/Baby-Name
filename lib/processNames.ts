import fs from 'fs/promises';
import path from 'path';
import csv from 'csv-parser';
import { Readable } from 'stream';
import OpenAI from 'openai';
import pLimit from 'p-limit';

const ITEMS_PER_MINUTE = 30000;
const BATCH_SIZE = 300;
const DELAY_BETWEEN_BATCHES = Math.floor(60000 / (ITEMS_PER_MINUTE / BATCH_SIZE));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Remove in production
});

const limit = pLimit(BATCH_SIZE);

interface NameData {
  sex: string;
  name: string;
  alt_spellings: string;
  n_sum: number;
  year_min: number;
  year_max: number;
  year_pop: number;
  biblical: boolean;
  palindrome: boolean;
  phones: string[];
  first_letter: string;
  stresses: string[];
  syllables: number;
  alliteration_first: number;
  unisex: boolean;
  aiDescription?: {
    meaning: string;
    origin: string;
    culturalSignificance: string[];
    notableBearers: string[];
    popularity: string;
    characteristics: string[];
    variants: string[];
    pronunciation: string;
  };
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getNameDescription(nameData: Omit<NameData, 'aiDescription'>): Promise<NameData['aiDescription']> {
  const prompt = `Generate detailed information about the name "${nameData.name}" in JSON format.
  
Example output format:
{
  "meaning": "From the Hebrew 'Miryam', meaning 'beloved' or 'bitter sea'",
  "origin": "Hebrew, with variations in multiple cultures",
  "culturalSignificance": [
    "Highly significant in Christian tradition through the Virgin Mary",
    "One of the most enduring female names in Western culture",
    "Royal connections through multiple European monarchs"
  ],
  "notableBearers": [
    "Mary, Queen of Scots (1542-1587)",
    "Mary Shelley (1797-1851), author of Frankenstein",
    "Mary Cassatt (1844-1926), American painter"
  ],
  "popularity": "One of the most consistently popular names throughout recorded history, peaking in the United States during the 1920s",
  "characteristics": [
    "Traditional and timeless",
    "Associated with virtue and grace",
    "Strong religious connotations"
  ],
  "variants": [
    "Maria (Latin/Spanish/Italian)",
    "Marie (French)",
    "Miriam (Hebrew)",
    "Maryam (Arabic)"
  ],
  "pronunciation": "MAIR-ee"
}

Consider these data points in your response:
- Gender: ${nameData.sex === 'F' ? 'Female' : nameData.sex === 'M' ? 'Male' : 'Unisex'}
- Biblical name: ${nameData.biblical ? 'Yes' : 'No'}
- First recorded year: ${nameData.year_min || 'Unknown'}
- Peak popularity year: ${nameData.year_pop || 'Unknown'}
- Alternative spellings: ${nameData.alt_spellings || 'None'}
- Syllables: ${nameData.syllables || 'Unknown'}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{
        role: "system",
        content: "You are an expert in names, their origins, meanings, and cultural significance. Provide detailed, accurate information in JSON format."
      }, {
        role: "user",
        content: prompt
      }],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    return JSON.parse(content);
  } catch (error) {
    console.error('Error getting AI response:', error);
    return {
      meaning: "",
      origin: "",
      culturalSignificance: [],
      notableBearers: [],
      popularity: "",
      characteristics: [],
      variants: [],
      pronunciation: ""
    };
  }
}

async function processNames(inputFile: string): Promise<NameData[]> {
  const names: NameData[] = [];
  const fileContent = await fs.readFile(inputFile, 'utf-8');
  const stream = Readable.from(fileContent);

  await new Promise((resolve, reject) => {
    stream
      .pipe(csv())
      .on('data', (row: any) => {
        names.push({
          sex: row.sex,
          name: row.name,
          alt_spellings: row.alt_spellings,
          n_sum: parseInt(row.n_sum),
          year_min: parseInt(row.year_min),
          year_max: parseInt(row.year_max),
          year_pop: parseInt(row.year_pop),
          biblical: row.biblical === '1.0',
          palindrome: row.palindrome === '1.0',
          phones: JSON.parse(row.phones.replace(/'/g, '"')),
          first_letter: row.first_letter,
          stresses: JSON.parse(row.stresses.replace(/'/g, '"')),
          syllables: parseInt(row.syllables),
          alliteration_first: parseFloat(row.alliteration_first),
          unisex: row.unisex === '1.0'
        });
      })
      .on('end', resolve)
      .on('error', reject);
  });

  const processedNames: NameData[] = [];
  let processedCount = 0;
  const startTime = Date.now();
  let lastLogTime = startTime;

  for (let i = 0; i < names.length; i += BATCH_SIZE) {
    const batch = names.slice(i, i + BATCH_SIZE);

    try {
      const batchResults = await Promise.all(
        batch.map(name => limit(() => getNameDescription(name)))
      );
      
      processedNames.push(...batch.map((name, index) => ({
        ...name,
        aiDescription: batchResults[index]
      })));
      
      processedCount += batch.length;

      // Log progress every 10 seconds
      const currentTime = Date.now();
      if (currentTime - lastLogTime >= 10000 || processedCount === names.length) {
        const elapsedMinutes = (currentTime - startTime) / 60000;
        const itemsPerMinute = Math.round(processedCount / elapsedMinutes);
        const progress = Math.floor((processedCount / names.length) * 100);
        const estimatedTotalMinutes = names.length / itemsPerMinute;
        const remainingMinutes = Math.max(0, estimatedTotalMinutes - elapsedMinutes);
        
        console.log(
          `Progress: ${progress}% | ` +
          `${processedCount.toLocaleString()}/${names.length.toLocaleString()} names | ` +
          `${itemsPerMinute.toLocaleString()}/minute | ` +
          `~${Math.round(remainingMinutes)}m remaining`
        );
        lastLogTime = currentTime;
      }

      if (i + BATCH_SIZE < names.length) {
        await sleep(DELAY_BETWEEN_BATCHES);
      }
    } catch (error) {
      console.error('Error processing batch:', error);
      continue;
    }
  }

  return processedNames;
}

export async function generateNameData() {
  const inputFile = path.join(process.cwd(), 'data', 'names.csv');
  const outputFile = path.join(process.cwd(), 'data', 'processed_names.json');

  console.log('Starting name data processing...');
  const processedNames = await processNames(inputFile);

  await fs.writeFile(outputFile, JSON.stringify(processedNames, null, 2));
  console.log('Name data processing completed!');

  return processedNames;
}