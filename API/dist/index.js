"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const keys_1 = require("./config/keys");
mongoose_1.default.connect(keys_1.env.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
const app = express_1.default();
app.get('/api', (res, req) => {
    console.log("dziala");
    req.send({ jaja: "dupa" });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT);
//# sourceMappingURL=index.js.map