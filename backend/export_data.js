const mongoose = require('mongoose');
const xlsx = require('xlsx');
const path = require('path');
const models = require('./models.cjs');

mongoose.connect('mongodb://127.0.0.1:27017/preetysalon')
    .then(async () => {
        console.log('Connected to MongoDB preetysalon');

        // Create a new Excel workbook
        const wb = xlsx.utils.book_new();

        // Object.entries(models) returns an array of [modelName, Model]
        for (const [modelName, Model] of Object.entries(models)) {
            // models.cjs exports both Payment and payment (duplicate reference)
            if (modelName === 'payment') continue;

            console.log(`Exporting collection: ${modelName}...`);
            const data = await Model.find().lean();
            
            // Format objects / arrays for better Excel viewing
            const formattedData = data.map(item => {
                const formattedItem = {};
                for (const key in item) {
                    if (key === '__v') continue;

                    let val = item[key];
                    if (val === null || val === undefined) {
                        formattedItem[key] = '';
                    } else if (typeof val === 'object') {
                        // Handle Date objects
                        if (val instanceof Date) {
                            formattedItem[key] = val.toISOString();
                        } else {
                            // Arrays or other objects
                            formattedItem[key] = JSON.stringify(val);
                        }
                    } else {
                        formattedItem[key] = val;
                    }
                }
                return formattedItem;
            });

            // Create worksheet from data, or an empty one if no data
            let ws;
            if (formattedData.length > 0) {
                ws = xlsx.utils.json_to_sheet(formattedData);
            } else {
                ws = xlsx.utils.json_to_sheet([{}]);
            }

            // Append sheet to workbook (sheet name max length 31 chars in Excel)
            const sheetName = modelName.substring(0, 31);
            xlsx.utils.book_append_sheet(wb, ws, sheetName);
        }

        const outputPath = path.join(__dirname, '../AllCollections.xlsx');
        xlsx.writeFile(wb, outputPath);

        console.log(`✅ All collections successfully exported to ${outputPath}`);
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Error during export:', err);
        process.exit(1);
    });
