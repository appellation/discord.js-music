"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Code;
(function (Code) {
    // voice channel codes
    Code[Code["NO_VOICE_CHANNEL"] = 0] = "NO_VOICE_CHANNEL";
    Code[Code["NOT_JOINABLE"] = 1] = "NOT_JOINABLE";
    Code[Code["NOT_SPEAKABLE"] = 2] = "NOT_SPEAKABLE";
    // voice connection errors
    Code[Code["NO_VOICE_CONNECTION"] = 3] = "NO_VOICE_CONNECTION";
    // playlist errors
    Code[Code["NO_CURRENT_SONG"] = 4] = "NO_CURRENT_SONG";
})(Code = exports.Code || (exports.Code = {}));
class CassetteError extends Error {
    constructor(code) {
        super(Code[code]);
        this.code = code;
    }
}
exports.default = CassetteError;
