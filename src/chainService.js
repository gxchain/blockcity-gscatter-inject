import GXClientFactory from 'gxclient'
import { accMult } from 'gxc-frontend-base/build/script/util/index'
import store from './store'

function getClientInstance() {
    return GXClientFactory.instance({
        network: store.get('witness')
    })
}

export async function getAmountAssetByStr(str) {
    const gxclient = getClientInstance()
    if (str) {
        if (str.indexOf(' ') == -1) {
            throw new Error('Incorrect format of asset, eg. "100 GXC"')
        }
    }
    let amount = str ? Number(str.split(' ').filter(o => !!o)[0]) : 0
    let assetSymbol = str ? str.split(' ').filter(o => !!o)[1] : 'GXC'
    const asset = await gxclient.getAsset(assetSymbol)
    return {
        amount: accMult(amount, Math.pow(10, asset.precision)),
        asset_id: asset.id
    }
}
