import Error from './Error'
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

export async function identityGuard(identity) {
    if (!identity) {
        throw Error.noIdentityError()
    }
}
