const express = require('express');
const path = require('path');
const app = express();
const port = 3001;

// Serve static files from the 'static' directory within templates
app.use('/static', express.static(path.join(__dirname, 'templates', 'static')));

// Serve the 'templates' directory within backend as a static root folder
app.use(express.static(path.join(__dirname, 'templates')));

// For any other request, send the products.html from backend/templates
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'products.html'));
});

// Also serve admin dashboard at /admin
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'admin.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).send('Server Error');
});

const server = app.listen(port, () => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🚀 EXPRESS SERVER STARTED SUCCESSFULLY`);
    console.log(`${'='.repeat(60)}\n`);
    console.log(`📱 PRODUCTS PAGE:     http://localhost:${port}`);
    console.log(`🔧 ADMIN DASHBOARD:   http://localhost:${port}/admin`);
    console.log(`⚙️  DJANGO API:        http://localhost:8000/product/public/`);
    console.log(`\n${'='.repeat(60)}`);
    console.log(`\n✅ Server is running and ready!`);
    console.log(`\n👉 OPEN YOUR BROWSER AND VISIT:\n   http://localhost:${port}\n`);
    console.log(`${'='.repeat(60)}\n`);
});

// Handle server errors
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`\n❌ Error: Port ${port} is already in use!`);
        console.error(`\nKill the existing process or use a different port.\n`);
        process.exit(1);
    } else {
        console.error('Server error:', err);
    }
});
