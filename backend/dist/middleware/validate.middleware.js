"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const express_validator_1 = require("express-validator");
const ApiError_1 = require("../utils/ApiError");
const validate = (req, _res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw ApiError_1.ApiError.badRequest('Dữ liệu không hợp lệ', errors.array());
    }
    next();
};
exports.validate = validate;
//# sourceMappingURL=validate.middleware.js.map