/**
 * 统一处理api错误，因为错误码返回情况必须跟pc端保持一致，所以需要统一处理一下
 */
import * as methodNames from './needErrorHandleMethodName'
import Error, { ErrorCodes } from './Error'
const map = {}

map._default = function (err) {
    return new Error(undefined, err.message || err.msg)
}

// 安卓会把除了code,msg,data之外的字段移除，所以为了保持前端error结构一致，需要重新处理一下
map[methodNames.TRANSFER] = map[methodNames.CALL_CONTRACT] = map[methodNames.VOTE] = function (err) {
    // 取消的情况
    if (+err.code === ErrorCodes.NO_SIGNATURE) {
        return Error.rejectSignature()
    } else if (+err.code === ErrorCodes.PASSWORD_ERROR) {
        return Error.passwordError()
    } else {
        return map._default(err)
    }
}

function createError(err, errName) {
    return map[errName] ? map[errName](err) : map._default(err)
}

export default function apiUniErrorHandler(err, reject, errName) {
    let error
    if (typeof err === 'string') {
        err = JSON.parse(decodeURIComponent(err))
    }
    if (err && err.isError) {
        error = err
    } else {
        error = createError(err, errName)
    }

    if (reject) {
        reject(error)
    } else {
        return error
    }
}
