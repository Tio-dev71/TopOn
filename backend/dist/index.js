"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const socket_io_1 = require("socket.io");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const passport_1 = require("./config/passport");
const socket_1 = require("./config/socket");
const error_middleware_1 = require("./middleware/error.middleware");
const notFound_middleware_1 = require("./middleware/notFound.middleware");
const logger_1 = __importDefault(require("./utils/logger"));
// Routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const profile_routes_1 = __importDefault(require("./routes/profile.routes"));
const campaign_routes_1 = __importDefault(require("./routes/campaign.routes"));
const content_routes_1 = __importDefault(require("./routes/content.routes"));
const payment_routes_1 = __importDefault(require("./routes/payment.routes"));
const analytics_routes_1 = __importDefault(require("./routes/analytics.routes"));
const reviewer_routes_1 = __importDefault(require("./routes/reviewer.routes"));
const rating_routes_1 = __importDefault(require("./routes/rating.routes"));
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
const blog_routes_1 = __importDefault(require("./routes/blog.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// Socket.io
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        credentials: true,
    },
});
exports.io = io;
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
}));
app.use((0, morgan_1.default)('combined', {
    stream: { write: (message) => logger_1.default.info(message.trim()) },
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, cookie_parser_1.default)());
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api', limiter);
// Auth rate limiting
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: 'Quá nhiều yêu cầu đăng nhập, vui lòng thử lại sau.',
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
// Passport
(0, passport_1.initPassport)();
(0, socket_1.initSocket)(io);
// Make io accessible in routes
app.set('io', io);
// API Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/profile', profile_routes_1.default);
app.use('/api/campaigns', campaign_routes_1.default);
app.use('/api/content', content_routes_1.default);
app.use('/api/payment', payment_routes_1.default);
app.use('/api/analytics', analytics_routes_1.default);
app.use('/api/reviewers', reviewer_routes_1.default);
app.use('/api/ratings', rating_routes_1.default);
app.use('/api/notifications', notification_routes_1.default);
app.use('/api/blog', blog_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Error handling
app.use(notFound_middleware_1.notFoundHandler);
app.use(error_middleware_1.errorHandler);
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    logger_1.default.info(`🚀 TopOn API running on http://localhost:${PORT}`);
    logger_1.default.info(`📊 Environment: ${process.env.NODE_ENV}`);
});
//# sourceMappingURL=index.js.map