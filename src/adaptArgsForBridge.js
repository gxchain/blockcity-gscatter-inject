import { getAmountAssetByStr } from './chainService'
import { makeFakeTransactionStruc } from './util'
const adapterMap = {}

adapterMap.callContract = async function (args, extra, resolve, reject) {
    const [contractName, methodName, params, amountStr, broadcast] = args
    const amount = await getAmountAssetByStr(amountStr)

    const ret = {
        type: 'contract',
        contractName,
        methodName,
        methodParams: params,
        amount,
        success: function (result) {
            resolve(result)
        },
        fail: function (result) {
            reject(result)
        },
        cancel: function (result) {
            reject(result)
        },
        extra: {
            ifJumpWalletSelect: true,
            account: extra.account
        }
    }

    return ret
}

adapterMap.transfer = async function (args, extra, resolve, reject) {
    const [to, memo, amountStr, broadcast] = args
    const amount = await getAmountAssetByStr(amountStr)

    const ret = {
        ...makeFakeTransactionStruc('transfer', {
            account: extra.account,
            to,
            memo,
            amount,
            originalArgs: { amountStr }
        }),
        success: function (result) {
            resolve(result)
        },
        fail: function (result) {
            reject(result)
        },
        cancel: function (result) {
            reject(result)
        }
    }

    return ret
}

adapterMap.vote = async function (args, extra, resolve, reject) {
    const [accounts, feeAssetSymbol, broadcast] = args

    const ret = {
        ...makeFakeTransactionStruc('vote', {
            account: extra.account,
            accounts,
            feeAssetSymbol
        }),
        success: function (result) {
            resolve(result)
        },
        fail: function (result) {
            reject(result)
        },
        cancel: function (result) {
            reject(result)
        }
    }

    return ret
}

adapterMap._noIdentity = async function (args, extra, resolve, reject) {
    const ret = {
        ...makeFakeTransactionStruc('noidentity'),
        success: function (result) {
            resolve(true)
        },
        fail: function (result) {
            resolve(true)
        },
        cancel: function (result) {
            resolve(true)
        }
    }

    return ret
}

export default function (name, args, ctx, resolve, reject) {
    return adapterMap[name](args, ctx, resolve, reject)
}
