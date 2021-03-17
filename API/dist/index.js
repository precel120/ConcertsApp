"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const keys_1 = require("./config/keys");
const auth_1 = __importDefault(require("./routes/auth"));
const events_1 = __importDefault(require("./routes/events"));
const tickets_1 = __importDefault(require("./routes/tickets"));
mongoose_1.default.connect(keys_1.env.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const app = express_1.default();
//Middlewares
app.use(express_1.default.static("public"));
app.use(express_1.default.json());
//Routing
app.use(auth_1.default);
app.use(tickets_1.default);
app.use(events_1.default);
app.use(function (err, req, res) {
    if (!err.statusCode)
        err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
});
const PORT = process.env.PORT || 5000;
app.listen(PORT);
//# sourceMappingURL=index.js.map