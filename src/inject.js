import * as methodNames from './needErrorHandleMethodName'
import apiUniErrorHandler from './apiUniErroHandler'
import { GXClient } from 'gxclient'
import Bridge from './bridge'

// TODO: 返回gxclient所需的地址
function getWsAddress(network) {

}

// TODO: 是否是需要Bridge提供的方法
function isBridgeProvideMethod(name) {

}

// TODO: 获取Bridge提供的方法，如transfer、vote、callContract等
function getBridgeMethod(name) {
    return function (...args) {
        // 只有需要发起交易的请求，才这样处理，如果不需要发起交易，则不需要处理requiredFields
        const requiredFields = args.find(arg => arg.hasOwnProperty('requiredFields'))
        return Bridge[name](...args).then(res => {
            if (requiredFields) {
                return {
                    transaction: res,
                    // TODO: 如果支持的话可以构造这个对象，不支持默认这样填就好了，这样开发者那边不会报错
                    returnedFields: {}
                }
            } else {
                return res
            }
        }).catch(err => {
            throw apiUniErrorHandler(err, null, name)
        })
    }
}

const gxc = function (network) {
    const gxclient = new GXClient('', '', `${getWsAddress(network)}`)
    const gxclientProxy = new Proxy(gxclient, {
        get(target, name) {
            if (isBridgeProvideMethod(name)) {
                // 必须是支持promise的
                return getBridgeMethod(name)
            }

            // pc端目前的规范是所有接口promise化
            return async function (...args) {
                return target[name](...args)
            }
        }
    })

    return gxclientProxy
}

class GScatter {
    constructor() {
        this.isExtension = true
        this.identity = null
        this.gxc = gxc
    }

    init() {
        // 不建议调用getIdentity，因为如果用户没有授权过，一进入页面就会让用户去授权，这样体验可能不太好。正常情况是用户需要点击触发getIdentity
        return new Promise(resolve => {
            resolve(true)
            // return this._getIdentityFromPermission()
        })
    }

    // TODO: 用户若之前授权过，直接从授权中取；如果没有授权，返回null。
    async _getIdentityFromPermission() {
        return Bridge.getIdentityFromPermission().then(identity => {
            this.useIdentity(identity)
        })
    }

    // TODO:
    // 功能：唤起弹窗选择身份，并返回选择的身份，同时注入到identity字段。如果已有身份，则将该身份注入identity字段。

    // requiredFields可参考https://get-scatter.com/docs/requirable-fields，意思是没有符合所要求的field，则不会返回identity，布洛克城不需要可以忽略。但如果开发者代码里写到了，比如personal:['email']，他会认为拿到的身份里有这个字段，也就是可以取到identity.personal.email，如果布洛克城不支持，可以提示开发者不要用requiredFileds
    getIdentity(requiredFields) {
        // identity最小数据结构如下
        // {
        //     "hash": "755c58601bd40455f02304e9e9bfd2ec6a9a165375929599ec738d8bcc3af07b",
        //     "publicKey": "GXC5wqXTnEhS3emTZihirFqADTQD4kRm2qrdEccquvSA9EkXzKdrW",
        //     "name": "RandomRaccoon1745955",
        //     "kyc": false
        // }

        // 根据requiredFields的不同，会增加相应的字段，比如说gscatter.getIdentity({ accounts: [network] })，那么identity就会带有accounts字段。开发者默认一定会写gscatter.getIdentity({ accounts: [network] })，数据结构至少要再加个accounts字段。

        // accounts是一个数组，每个对象结构为：
        // {
        //     authority: "active",     // 默认active就行
        //     blockchain: "gxc",    // 默认gxc就行
        //     name: "youxiu123"    // 账户名
        // }
        return new Promise((resolve, reject) => {
            // 身份不存在，则弹出身份选择窗口，选择之后记录该身份，下次调用无需重复选择，直接返回
            Bridge.promptSelectIdentity(requiredFields).then((identity) => {
                this.useIdentity(identity)
                resolve(identity)
            }).catch(err => {
                apiUniErrorHandler(err, reject, methodNames.GET_IDENTITY)
            })
        })
    }

    // TODO: 移除该dapp的授权
    forgetIdentity() {
        return new Promise((resolve, reject) => {
            Bridge.removeIdentity().then(() => {
                resolve(true)
            }).catch(err => {
                apiUniErrorHandler(err, reject, methodNames.FORGET_IDENTITY)
            })
        })
    }

    useIdentity(identity) {
        this.identity = identity
    }

    // DONE 不用写
    suggestNetwork(network) {
        return Promise.resolve(true)
    }

    // DONE 不用写
    requireVersion(version) {

    }

    // DONE 不用写
    authenticate() {
        return Promise.resolve('')
    }
}

window.gscatter = new GScatter()
window.gscatter.init().then(() => {
    // init会去获取identity
    document.dispatchEvent(new CustomEvent('gscatterLoaded'))
})
