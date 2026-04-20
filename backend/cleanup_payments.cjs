const mongoose = require('mongoose');
const { Payment } = require('./models.cjs');

async function cleanup() {
    try {
        await mongoose.connect('mongodb://localhost:27017/preetysalon');
        console.log('Connected to DB');
        
        // Remove payments with status 'created' or 'failed' and no paymentid
        // This helps resolve index conflicts if multiple null paymentids existed
        const result = await Payment.deleteMany({ 
            $or: [
                { paymentid: { $exists: false } },
                { paymentid: null },
                { paymentid: "" }
            ],
            status: { $in: ['created', 'failed'] }
        });
        
        console.log(`Deleted ${result.deletedCount} incomplete payment records.`);
        
        // Drop the index to force rebuild with sparse: true
        try {
            await Payment.collection.dropIndex('paymentid_1');
            console.log('Dropped paymentid_1 index');
        } catch (e) {
            console.log('Index paymentid_1 not found or already dropped');
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

cleanup();
