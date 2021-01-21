"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StatusError extends Error {
    constructor(message, code) {
        super();
        this.message = message;
        this.code = code;
    }
}
exports.default = StatusError;
//# sourceMappingURL=StatusError.js.map