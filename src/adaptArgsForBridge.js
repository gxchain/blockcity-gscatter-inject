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
            alert('成功：' + result)
        },
        fail: function (result) {
            alert('失败：' + result)
        },
        cancel: function (result) {
            alert('取消：' + result)
        },
        extra: {
            ifJumpWalletSelect: true,
            account: extra.identity
        }
    }

    return ret
}

adapterMap.transfer = async function (args, extra, resolve, reject) {
    const [to, memo, amountStr, broadcast] = args
    const amount = await getAmountAssetByStr(amountStr)

    const ret = {
        ...makeFakeTransactionStruc('transfer', {
            account: extra.identity,
            to,
            memo,
            amount,
            originalArgs: { amountStr }
        }),
        success: function (result) {
            alert('成功：' + result)
        },
        fail: function (result) {
            alert('失败：' + result)
        },
        cancel: function (result) {
            alert('取消：' + result)
        }
    }

    return ret
}

adapterMap.vote = async function (args, extra, resolve, reject) {
    const [accounts, feeAssetSymbol, broadcast] = args

    const ret = {
        ...makeFakeTransactionStruc('vote', {
            account: extra.identity,
            accounts,
            feeAssetSymbol
        }),
        success: function (result) {
            alert('成功：' + result)
        },
        fail: function (result) {
            alert('失败：' + result)
        },
        cancel: function (result) {
            alert('取消：' + result)
        }
    }

    return ret
}

export default function (name, args, resolve, reject) {
    return adapterMap[name](args, resolve, reject)
}
