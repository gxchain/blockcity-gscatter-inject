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

export function noIdentityHandle() {
    alert('没有账户，请在公信链钱包中导入!(临时交互)')
}

export async function identityGuard(identity) {
    if (!identity) {
        noIdentityHandle()
        throw Error.noIdentityError()
    }
}
