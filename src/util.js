const fakeParams = {
    contractName: 'fake',
    amount: {
        amount: 1,
        asset_id: '1.3.1'
    },
    methodName: 'fakeMethod',
    methodParams: {}
}

export function makeFakeTransactionStruc(type, data = {}) {
    return {
        ...fakeParams,
        type,
        extra: data
    }
}

export function handleRes(res) {
    const sourceSuccess = res.success
    res.success = function (ret) {
        try {
            ret = JSON.parse(decodeURIComponent(ret))
        } catch (err) { }
        sourceSuccess && sourceSuccess(ret)
    }
    return res
}
