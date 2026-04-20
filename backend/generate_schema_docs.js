const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const models = require('./models.cjs');

let markdown = '# Database Collections Documentation\n\nThis document outlines the schema details for all collections in the Preety Salon database.\n\n';

for (const [modelName, Model] of Object.entries(models)) {
    if (modelName === 'payment') continue; // duplicate export

    markdown += `## Collection: **${modelName}**\n\n`;
    markdown += '| Field Name | Data Type | Required | Unique | Default | Notes |\n';
    markdown += '|---|---|---|---|---|---|\n';

    const schema = Model.schema;
    
    // Extracting paths (fields) from schema
    for (const [pathName, schemaType] of Object.entries(schema.paths)) {
        if (pathName === '__v') continue; // Skip mongoose internal version key

        // Determine Type
        let typeStr = schemaType.instance;
        if (schemaType.options && Array.isArray(schemaType.options.type)) {
            typeStr = `Array of ${schemaType.caster ? schemaType.caster.instance : 'Mixed'}`;
        }
        
        let isRequired = schemaType.isRequired ? '✅ Yes' : 'No';
        let isUnique = schemaType.options && schemaType.options.unique ? '✅ Yes' : 'No';
        
        // Handle Default value elegantly
        let defaultVal = schemaType.options && schemaType.options.default;
        let defaultStr = '';
        if (defaultVal !== undefined && defaultVal !== null) {
            if (typeof defaultVal === 'function') {
                defaultStr = '*Computed*';
            } else if (defaultVal === '') {
                defaultStr = `"" (Empty String)`;
            } else {
                defaultStr = String(defaultVal);
            }
        }
            
        let notes = '';
        if (schemaType.options && schemaType.options.enum) {
            notes = `Enum: ${schemaType.options.enum.join(', ')}`;
        }
        if (schemaType.options && schemaType.options.ref) {
            notes = (notes ? notes + '<br>' : '') + `Ref: **${schemaType.options.ref}**`;
        }

        markdown += `| \`${pathName}\` | ${typeStr} | ${isRequired} | ${isUnique} | ${defaultStr} | ${notes} |\n`;
    }
    
    markdown += '\n---\n\n';
}

const outputPath = path.join(__dirname, '../Database_Schema.md');
fs.writeFileSync(outputPath, markdown, 'utf-8');
console.log('Documentation generated successfully at:', outputPath);
process.exit(0);
