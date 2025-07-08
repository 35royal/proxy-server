const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Cấu hình CORS để cho phép tất cả nguồn gốc
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Route mặc định để kiểm tra server
app.get('/', (req, res) => {
    res.json({ message: 'Proxy server is running' });
});

// Proxy cho các URL video
app.use('/proxy', createProxyMiddleware({
    target: 'https://', // Không cần target cụ thể, lấy từ path
    changeOrigin: true,
    pathRewrite: (path, req) => {
        const targetUrl = path.replace('/proxy/', '');
        return targetUrl;
    },
    onError: (err, req, res) => {
        console.error('Proxy error:', err);
        res.status(500).send('Proxy error');
    }
}));

// Lắng nghe trên port từ biến môi trường của Render
const port = process.env.PORT || 10000;
app.listen(port, () => {
    console.log(`Proxy server running on port ${port}`);
});