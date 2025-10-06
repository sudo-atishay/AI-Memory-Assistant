const { initDatabase } = require('../config/database');

const initializeDatabase = async () => {
  try {
    await initDatabase();
    console.log('Database initialized successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

initializeDatabase();
