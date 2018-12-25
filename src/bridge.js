import BlockCity from 'blockcity-js-sdk/index'
import adaptArgsForBridge from './adaptArgsForBridge'

class Bridge {
    constructor(context) {
        this.ctx = context
    }

    promptSelectIdentity() {
        return new Promise((resolve, reject) => {
            BlockCity.callAuth({
                authItem: 'account',
                success: function (result) {
                    alert('成功：' + result)
                },
                fail: function (result) {
                    alert('失败：' + result)
                },
                cancel: function (result) {
                    alert('取消：' + result)
                }
            })
        })
    }

    callContract() {
        return new Promise(async (resolve, reject) => {
            const adaptedArgs = await adaptArgsForBridge('callContract', arguments, this.ctx, resolve, reject)
            BlockCity.callContract(adaptedArgs)
        })
    }

    transfer() {
        return new Promise(async (resolve, reject) => {
            const adaptedArgs = await adaptArgsForBridge('transfer', arguments, this.ctx, resolve, reject)
            BlockCity.callContract(adaptedArgs)
        })
    }

    vote() {
        return new Promise(async (resolve, reject) => {
            const adaptedArgs = await adaptArgsForBridge('vote', arguments, this.ctx, resolve, reject)
            BlockCity.callContract(adaptedArgs)
        })
    }
}

export default Bridge
