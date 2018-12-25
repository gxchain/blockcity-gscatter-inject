const fakeParams = {
    contractName: 'fake',
    amount: {
        amount: 1,
        asset_id: '1.3.1'
    },
    methodName: 'fakeMethod',
    methodParams: {}
}

export function makeFakeTransactionStruc(type, data) {
    return {
        ...fakeParams,
        type,
        extra: data
    }
}
