import * as ErrorTypes from './ErrorTypes'

export const ErrorCodes = {
    NO_SIGNATURE: 402,
    UN_DEF_ERROR: 433,
    PASSWORD_ERROR: 434,
    NO_IDENTITY: 435
}

export default class Error {
    constructor(_type = ErrorTypes.UN_DEF_ERROR, _message, _code = ErrorCodes.UN_DEF_ERROR) {
        this.type = _type
        this.message = _message
        this.code = _code
        this.isError = true
    }

    static signatureError (_type = ErrorTypes.NO_SIGNATURE, _message) {
        return new Error(_type, _message, ErrorCodes.NO_SIGNATURE)
    }

    static rejectSignature() {
        return Error.signatureError('signature_rejected', 'User rejected the signature request')
    }

    static noIdentityError(msg = 'no identity found') {
        return new Error(
            ErrorTypes.NO_IDENTITY,
            msg,
            ErrorCodes.NO_IDENTITY
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
