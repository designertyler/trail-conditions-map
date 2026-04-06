console.log('=== SERVER STARTING ===');

console.log('=== ENVIRONMENT VARIABLES ===');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log(
  'SUPABASE_ANON_KEY:',
  process.env.SUPABASE_ANON_KEY ? 'Present' : 'Missing'
);
console.log('==============================');

import express from 'express';
import cors from 'cors';
import { WeatherService } from './services/WeatherService';
import { TrailConditionsScraper } from './services/TrailConditionsScraper';
import { supabase } from './utils/supabase';

const app = express();
console.log('App created');

const PORT = process.env.PORT || 3001;

const weatherService = new WeatherService();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Trail Conditions API is running!' });
});

app.get('/api/weather/test', async (_req, res) => {
  try {
    const weather = await weatherService.getAustinAreaWeather();
    res.json(weather);
  } catch (error) {
    console.error('Weather error:', error);
    res.status(500).json({ error: 'Weather service failed' });
  }
});

const scraper = new TrailConditionsScraper();

// Add route to manually trigger updates
app.get('/api/update-conditions', async (_req, res) => {
  try {
    await scraper.updateTrailConditions();
    res.json({ message: 'Trail conditions updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update trail conditions' });
  }
});

app.get('/api/trails', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('trails')
      .select('*')
      .order('name');

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trails' });
  }
});

// Start scheduled updates
scraper.scheduleUpdates();

// Shut down gracefully
process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
