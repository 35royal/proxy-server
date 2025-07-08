const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Cấu hình CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Route mặc định
app.get('/', (req, res) => {
    res.json({ message: 'Proxy server is running' });
});

// Proxy cho các URL video
app.use('/proxy', createProxyMiddleware({
    target: 'https://', // Placeholder, sẽ được thay thế bởi path
    changeOrigin: true,
    router: (req) => {
        // Lấy URL đích từ path
        const targetUrl = req.originalUrl.replace('/proxy/', '');
        return new URL(targetUrl).origin; // Chỉ lấy origin, path sẽ được rewrite
    },
    pathRewrite: (path, req) => {
        return path.replace('/proxy/', ''); // Loại bỏ /proxy/ khỏi path
    },
    onProxyReq: (proxyReq, req, res) => {
        console.log(`Proxying request to: ${req.originalUrl}`);
    },
    onError: (err, req, res) => {
        console.error('Proxy error:', err.message);
        res.status(500).json({ error: 'Proxy error', details: err.message });
    },
    secure: false // Cho phép proxy các kết nối HTTPS không được xác minh (nếu cần)
}));

// Lắng nghe port từ Render
const port = process.env.PORT || 10000;
app.listen(port, () => {
    console.log(`Proxy server running on port ${port}`);
});