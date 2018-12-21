import GXClientFactory from 'gxclient'
import { accMult } from 'gxc-frontend-base/build/script/util/index'

const gxclient = GXClientFactory.instance({
    network: 'ws://47.96.164.78:28090'
})

export async function getAmountAssetByStr(str) {
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
