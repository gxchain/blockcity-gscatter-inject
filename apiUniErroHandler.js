/**
 * 统一处理api错误，因为错误码返回情况必须跟pc端保持一致，所以需要统一处理一下
 */
import * as errorTypes from './errorTypes'
// import Error from 'Error'
const map = {}

map._default = function (err) {
    return new Error(undefined, err.message)
}

map[errorTypes.FORGET_IDENTITY] = function (err) {
    return map._default(err)
}

map[errorTypes.GET_IDENTITY] = function (err) {
    // TODO: 若用户cancel，则抛出 NO_PERMISSION 错误，跟pc保持一致
    if ('xxx') {
        // TODO: 参数可以自己定，代表errorMsg
        return Error.noPermissionError('xxx')
    } else {
        // 其它情况
        return map._default(err)
    }
}

map[errorTypes.TRANSFER] = map[errorTypes.CALL_CONTRACT] = map[errorTypes.VOTE] = function (err) {
    // TODO: 若没有授权
    if ('xxx') {
        // TODO: 参数可以自己定，代表errorMsg
        return Error.noPermissionError('xxx')
    } else {
        // 其它情况
        return map._default(err)
    }
}

function createError(err, errName) {
    return map[errName] ? map[errName](err) : map._default(err)
}

export default function apiUniErrorHandler(err, reject, errName) {
    const error = createError(err, errName)
    if (reject) {
        reject(error)
    } else {
        return error
    }
}
