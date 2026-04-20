const fs = require('fs');
const path = require('path');

function processDirectory(directory, searchString, envVariable) {
    if (!fs.existsSync(directory)) return;

    const files = fs.readdirSync(directory);
    let changedFiles = 0;

    for (const file of files) {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            changedFiles += processDirectory(fullPath, searchString, envVariable);
        } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;

            // Scenario 1: Inside single-tick string: 'http://localhost:5000/api...'
            // Becomes: import.meta.env.VITE_API_URL + '/api...'
            const singleQuoteRegex = new RegExp(`'${searchString}(.*?)'`, 'g');
            content = content.replace(singleQuoteRegex, `import.meta.env.${envVariable} + '$1'`);

            // Clean up: if it ends with + '' (which happens if there was no path suffix)
            content = content.replace(new RegExp(`\\+ ''`, 'g'), '');

            // Scenario 2: Inside double-tick string: "http://localhost:5000/api..."
            const doubleQuoteRegex = new RegExp(`"${searchString}(.*?)"`, 'g');
            content = content.replace(doubleQuoteRegex, `import.meta.env.${envVariable} + "$1"`);
            content = content.replace(new RegExp(`\\+ ""`, 'g'), '');

            // Scenario 3: Inside a backtick literal without existing expression: `http://localhost:5000/api...`
            // Becomes: `${import.meta.env.VITE_API_URL}/api...`
            // Watch out for nested expressions. Regex is hard, but simple ones work
            const backtickRegex = new RegExp(`\`${searchString}(.*?)\``, 'g');
            content = content.replace(backtickRegex, `\`\${import.meta.env.${envVariable}}$1\``);
            
            // Just in case there's an exact string match without quotes wrapped in another file structure
            // we will replace any left over:
            // Let's only do the string quotes to avoid breaking syntax.

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated: ${fullPath}`);
                changedFiles++;
            }
        }
    }
    return changedFiles;
}

console.log("Starting script to replace hardcoded API URLs...");

const clientChanged = processDirectory(path.join(__dirname, 'client', 'src'), 'http://localhost:5000', 'VITE_API_URL');
const adminChanged = processDirectory(path.join(__dirname, 'admin', 'src'), 'http://localhost:5001', 'VITE_ADMIN_API_URL');

console.log(`Finished. Updated ${clientChanged} client files and ${adminChanged} admin files.`);

// Write the local .env files so local dev still works
fs.writeFileSync(path.join(__dirname, 'client', '.env'), 'VITE_API_URL=http://localhost:5000\n', 'utf8');
fs.writeFileSync(path.join(__dirname, 'admin', '.env'), 'VITE_ADMIN_API_URL=http://localhost:5001\n', 'utf8');
console.log("Created local .env files.");
