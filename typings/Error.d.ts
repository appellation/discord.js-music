export declare enum Code {
    NO_VOICE_CHANNEL = 0,
    NOT_JOINABLE = 1,
    NOT_SPEAKABLE = 2,
    NO_VOICE_CONNECTION = 3,
    NO_CURRENT_SONG = 4,
}
declare class CassetteError extends Error {
    readonly code: Code;
    constructor(code: Code);
}
export default CassetteError;
