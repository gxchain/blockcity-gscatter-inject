import * as ErrorTypes from './ErrorTypes'

export const ErrorCodes = {
    NO_SIGNATURE: 402,
    NO_PERMISSION: 432,
    UN_DEF_ERROR: 433,
    PASSWORD_ERROR: 434
}

export default class Error {
    constructor(_type = ErrorTypes.UN_DEF_ERROR, _message, _code = ErrorCodes.UN_DEF_ERROR) {
        this.type = _type
        this.message = _message
        this.code = _code
        this.isError = true
    }

    static signatureError(_type, _message) {
        return new Error(_type, _message, ErrorCodes.NO_SIGNATURE)
    }

    static rejectSignature() {
        return Error.signatureError('signature_rejected', 'User rejected the signature request')
    }

    static noPermissionError(msg = 'Haven\'t authorize yet') {
        return new Error(
            ErrorTypes.NO_PERMISSION,
            msg,
            ErrorCodes.NO_PERMISSION
        )
    }

    static passwordError() {
        return new Error(
            ErrorTypes.PASSWORD_ERROR,
            'password error',
            ErrorCodes.PASSWORD_ERROR
        )
    }
}
