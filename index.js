const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Cấu hình CORS để cho phép tất cả nguồn gốc (có thể tùy chỉnh)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Proxy cho các URL video
app.use('/proxy', createProxyMiddleware({
    target: 'https://', // Không cần chỉ định target cụ thể, sẽ lấy từ URL
    changeOrigin: true,
    pathRewrite: (path, req) => {
        // Lấy URL đích từ query parameter hoặc path
        const targetUrl = path.replace('/proxy/', '');
        return targetUrl;
    },
    onError: (err, req, res) => {
        console.error('Proxy error:', err);
        res.status(500).send('Proxy error');
    }
}));

// Cổng mặc định cho Render
const port = process.env.PORT || 10000;
app.listen(port, () => {
    console.log(`Proxy server running on port ${port}`);
});