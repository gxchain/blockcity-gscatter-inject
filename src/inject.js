import apiUniErrorHandler from './apiUniErroHandler'
import { GXClient } from 'gxclient'
import Bridge from './bridge'
import store from './store'
import { getIdentity, getChainId } from './nativeService'
import { WITNESS_MAP } from './const'
import Error from './Error'
import { noIdentityHandle } from './util'

function isBridgeProvideMethod(name) {
    const arr = ['callContract', 'transfer', 'vote']
    return arr.includes(name)
}

class GScatter {
    constructor() {
        this.isExtension = true
        this.identity = null
        this.account = null
        this.gxc = this._gxcGenerator
        this._bridge = new Bridge(this)
    }

    init() {
        // 不建议调用getIdentity，因为如果用户没有授权过，一进入页面就会让用户去授权，这样体验可能不太好。正常情况是用户需要点击触发getIdentity
        return new Promise(async (resolve) => {
            const witness = await this._getWitness()
            store.set('witness', witness)
            const identity = await getIdentity()
            this.useIdentity(identity)

            resolve(true)
        })
    }

    getIdentity(requiredFields) {
        return new Promise(async (resolve, reject) => {
            const identity = await getIdentity()
            this.useIdentity(identity)
            noIdentityHandle()
            resolve(identity)
        })
    }

    // 无法退出
    forgetIdentity() {
        return Promise.reject(new Error(undefined, 'not support logout in blockcity'))
    }

    useIdentity(identity) {
        this.identity = identity
        this.account = identity ? identity.accounts[0].name : null
    }

    suggestNetwork(network) {
        return Promise.resolve(true)
    }

    requireVersion(version) {

    }

    authenticate() {
        return Promise.resolve('')
    }

    async _getWitness() {
        const chainId = await getChainId()
        return WITNESS_MAP[chainId]
    }

    _gxcGenerator(network) {
        const self = this
        const gxclient = new GXClient('', '', store.get('witness'))
        const gxclientProxy = new Proxy(gxclient, {
            get(target, name) {
                if (isBridgeProvideMethod(name)) {
                    // 必须是支持promise的
                    return self._getBridgeMethod(name)
                }

                // pc端目前的规范是所有接口promise化
                return async function (...args) {
                    let ret
                    try {
                        ret = await target[name](...args)
                    } catch (err) {
                        throw new Error(undefined, err.message)
                    }
                    return ret
                }
            }
        })

        return gxclientProxy
    }

    _getBridgeMethod(name) {
        return (...args) => {
            // 只有需要发起交易的请求，才这样处理，如果不需要发起交易，则不需要处理requiredFields
            const requiredFields = args.find(arg => arg.hasOwnProperty('requiredFields'))
            return this._bridge[name](...args).then(res => {
                try {
                    res = JSON.parse(decodeURIComponent(res))
                } catch (err) { }

                const trxObj = {
                    block_num: res.data.block_num,
                    id: res.data.trx_id,
                    trx_num: 0,
                    trx: {}
                }

                if (requiredFields) {
                    return {
                        transaction: trxObj,
                        // TODO: 如果支持的话可以构造这个对象，不支持默认这样填就好了，这样开发者那边不会报错
                        returnedFields: {}
                    }
                } else {
                    return trxObj
                }
            }).catch(err => {
                throw apiUniErrorHandler(err, null, name)
            })
        }
    }
}

window.gscatter = new GScatter()

// init会去获取identity和chainId
window.gscatter.init().then(() => {
    document.dispatchEvent(new CustomEvent('gscatterLoaded'))
})
