const http = require('http');
const app = require('./app'); // Ensure app.js is correctly imported

const port = process.env.PORT || 3012;

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
