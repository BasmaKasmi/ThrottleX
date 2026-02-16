"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const in_memory_policy_repository_1 = require("./repositories/in-memory-policy.repository");
const sliding_window_service_1 = require("./services/sliding-window.service");
const policies_controller_1 = require("./controllers/policies.controller");
const evaluate_controller_1 = require("./controllers/evaluate.controller");
function createApp() {
    const app = (0, express_1.default)();
    // Middleware
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    // Repositories & Services
    const policyRepo = new in_memory_policy_repository_1.InMemoryPolicyRepository();
    const rateLimiter = new sliding_window_service_1.SlidingWindowRateLimiter();
    // Controllers
    const policiesController = new policies_controller_1.PoliciesController(policyRepo);
    const evaluateController = new evaluate_controller_1.EvaluateController(policyRepo, rateLimiter);
    // Routes
    app.post('/policies', (req, res) => policiesController.create(req, res));
    app.get('/policies/:tenantId', (req, res) => policiesController.getByTenantId(req, res));
    app.post('/evaluate', (req, res) => evaluateController.evaluate(req, res));
    // Health check
    app.get('/health', (req, res) => {
        res.status(200).json({ status: 'ok' });
    });
    return app;
}
//# sourceMappingURL=app.js.map