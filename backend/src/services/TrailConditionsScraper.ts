import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export class TrailConditionsScraper {
  private readonly csvUrl =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vT8vd0cOdPGg5l0HmhfxSZ7o0qwzrn2r93y4ZQ3Ajo8ZuXyJSAgZ8WtRDwyZnYzVMtApZXS5gHjHk03/pub?gid=0&single=true&output=csv';

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

  private async updateTrailInDatabase(
    trailName: string,
    status: string,
    lastUpdated: string
  ): Promise<void> {
    const normalizedStatus = this.normalizeStatus(status);

    const { error } = await supabase
      .from('trails')
      .update({
        status: normalizedStatus,
        last_updated: lastUpdated || new Date().toISOString(),
      })
      .ilike('name', `%${trailName}%`);

    if (error) {
      console.error(`Failed to update ${trailName}:`, error);
    } else {
      console.log(`Updated ${trailName}: ${normalizedStatus}`);
    }
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
