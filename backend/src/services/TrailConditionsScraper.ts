import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export class TrailConditionsScraper {
  // Map Google Sheet names to database ID
  private readonly trailNameMapping: { [key: string]: string } = {
    'BCGB - West': 'bcgb-west',
    'BCGB - East': 'bcgb-east',
    'Bluff Creek Ranch': 'bluff-creek-ranch',
    'Brushy - Peddlers': 'bc-peddlers-pass',
    'Brushy - 1/4 Notch': 'bc-quarter-notch',
    'Brushy - Double Down': 'bc-dd',
    'Brushy - Suburban Ninja': 'bc-suburban-ninja',
    'Brushy - West': 'bc-west',
    'Bull Creek': 'bull-creek',
    'Cat Mountain': 'cat-mountain',
    'Emma Long': 'emma-long',
    'Flat Creek': 'flat-creek',
    'Flat Rock Ranch': 'flat-rock-ranch',
    'Lake Georgetown': 'lake-georgetown',
    Lakeway: 'mt-lakeway',
    'Mary Moore Searight': 'mary-moore-searight',
    'McKinney Falls': 'mckinney-falls',
    'Mule Shoe': 'muleshoe-bend',
    'Pace Bend': 'pace-bend',
    'Pedernales Falls': 'pedernales-falls',
    'Reimers Ranch': 'milton-reimers-ranch',
    'Reveille Peak Ranch': 'reveille-peak-ranch',
    'Rocky Hill Ranch': 'rocky-hill-ranch',
    'Maxwell Trail': 'maxwell-trail',
    'SATN - west of mopac': 'satn-west-mopac',
    'SATN - east of mopac': 'satn-east-mopac',
    'Spider Mountain': 'spider-mountain',
    'St. Edwards': 'st-edwards',
    Thumper: 'thumper',
    'Walnut Creek': 'walnut-creek',
  };

  private readonly csvUrl =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vT8vd0cOdPGg5l0HmhfxSZ7o0qwzrn2r93y4ZQ3Ajo8ZuXyJSAgZ8WtRDwyZnYzVMtApZXS5gHjHk03/pub?gid=0&single=true&output=csv';

  private async updateTrailInDatabase(
    sheetTrailName: string,
    status: string,
    lastUpdated: string
  ): Promise<void> {
    const trailId = this.trailNameMapping[sheetTrailName];

    if (!trailId) {
      console.log(`No mapping found for: ${sheetTrailName}`);
      return;
    }

    const normalizedStatus = this.normalizeStatus(status);

    const { error } = await supabase
      .from('trails')
      .update({
        status: normalizedStatus,
        last_updated: lastUpdated || new Date().toISOString(),
      })
      .eq('id', trailId); // Use exact ID match instead of fuzzy name search

    if (error) {
      console.error(`Failed to update ${trailId}:`, error);
    } else {
      console.log(`Updated ${trailId}: ${normalizedStatus}`);
    }
  }

  async updateTrailConditions(): Promise<void> {
    try {
      console.log('Fetching trail conditions from Google Sheets...');

      const response = await axios.get(this.csvUrl);
      const lines = response.data.split('\n');

      // Skip header row
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const [trailName, status, lastUpdated] = this.parseCSVLine(line);

        if (trailName && status) {
          await this.updateTrailInDatabase(trailName, status, lastUpdated);
        }
      }

      console.log('Trail conditions updated successfully');
    } catch (error) {
      console.error('Failed to update trail conditions:', error);
    }
  }

  private parseCSVLine(line: string): [string, string, string] {
    // Handle CSV parsing with quotes
    const columns = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        columns.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    columns.push(current.trim());

    return [columns[0] || '', columns[1] || '', columns[2] || ''];
  }

  private normalizeStatus(status: string): string {
    const normalizedStatus = status.toLowerCase();

    if (normalizedStatus.includes('open')) return 'open';
    if (normalizedStatus.includes('closed')) return 'closed';
    if (
      normalizedStatus.includes('wet') ||
      normalizedStatus.includes("don't ride")
    )
      return "wet, don't ride";
    if (normalizedStatus.includes('update')) return 'needs update';

    return 'needs update';
  }

  async scheduleUpdates(): Promise<void> {
    // Run immediately
    await this.updateTrailConditions();

    // Then run every 30 minutes
    setInterval(
      () => {
        this.updateTrailConditions();
      },
      30 * 60 * 1000
    );
  }
}
