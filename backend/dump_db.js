const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const models = require('./models.cjs');

const backupDir = path.join(__dirname, '../db_backup');
if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
}

async function dumpDB() {
    try {
        await mongoose.connect('mongodb://localhost:27017/preetysalon');
        console.log('Connected to MongoDB');

        const modelNames = Object.keys(models);
        for (const name of modelNames) {
            const Model = models[name];
            if (Model.find) {
                const data = await Model.find({}).lean();
                const filePath = path.join(backupDir, `${name}.json`);
                fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
                console.log(`Exported ${data.length} records for ${name}`);
            }
        }
        
        console.log('Database dump completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error dumping database:', error);
        process.exit(1);
    }
}

dumpDB();
