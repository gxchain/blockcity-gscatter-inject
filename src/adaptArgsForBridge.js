import { getAmountAssetByStr } from './service'
const adapterMap = {}

adapterMap.callContract = async function (args, resolve, reject) {
    const [contractName, methodName, params, amountStr, broadcast] = args
    const amount = await getAmountAssetByStr(amountStr)

    const ret = {
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
        }
    }

    return ret
}

export default function (name, args, resolve, reject) {
    return adapterMap[name](args, resolve, reject)
}
