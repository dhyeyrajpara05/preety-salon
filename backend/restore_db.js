const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const models = require('./models.cjs');

const backupDir = path.join(__dirname, '../db_backup');
if (!fs.existsSync(backupDir)) {
    console.error('No backup directory found at', backupDir);
    process.exit(1);
}

async function restoreDB() {
    try {
        await mongoose.connect('mongodb://localhost:27017/preetysalon');
        console.log('Connected to MongoDB');

        const modelNames = Object.keys(models);
        for (const name of modelNames) {
            const Model = models[name];
            const filePath = path.join(backupDir, `${name}.json`);
            if (fs.existsSync(filePath) && Model.insertMany) {
                const fileData = fs.readFileSync(filePath, 'utf-8');
                const data = JSON.parse(fileData);
                if (data && data.length > 0) {
                    await Model.deleteMany({}); // Optional: comment out if you want to keep existing data
                    await Model.insertMany(data);
                    console.log(`Restored ${data.length} records for ${name}`);
                } else {
                    console.log(`No records to restore for ${name}`);
                }
            } else {
                console.log(`Skipped ${name}. File not found or invalid model.`);
            }
        }
        
        console.log('Database restore completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error restoring database:', error);
        process.exit(1);
    }
}

restoreDB();
