const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Replace with your bot's token
const token = '7452136597:AAFYPcP-lySYfzFKeqnNeU85hQfZJntrq-I';

// Replace with your channel username (e.g., @your_channel)
const channelUsername = '@TossUpdater1';

// Create a new bot instance
const bot = new TelegramBot(token, { polling: true });

// Your API endpoint (replace with your actual API)
const apiEndpoint = 'https://unrivaled-salmiakki-1a0c80.netlify.app/.netlify/functions/api/demo';

// Variable to store the last known TossUpdate
let lastTossUpdate = null;

// Function to fetch data from the API
const fetchTossUpdate = async () => {
  try {
    const response = await axios.get(apiEndpoint);
    return response.data;
  } catch (error) {
    console.error('Error fetching TossUpdate from API:', error.message);
    return null;
  }
};

// Function to check for updates and post to the channel
const checkForUpdates = async () => {
  try {
    const tossData = await fetchTossUpdate();

    if (tossData && tossData.TossUpdate && tossData.TossUpdate !== lastTossUpdate) {
      // The toss update has changed, so post the update to the channel
      const message = `Toss Update: ${tossData.TossUpdate}`;

      // Send the message to the Telegram channel
      await bot.sendMessage(channelUsername, message);

      // Update the last known TossUpdate
      lastTossUpdate = tossData.TossUpdate;
    }
  } catch (error) {
    console.error('Error checking for updates:', error.message);
  }
};

// Poll the API for updates every 5 seconds
setInterval(checkForUpdates, 5000); // 5000 ms = 5 seconds

// Immediately check for updates on bot start
checkForUpdates();
