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
            const adaptedArgs = await adaptArgsForBridge('callContract', arguments, resolve, reject)
            BlockCity.callContract({
                ...adaptedArgs,
                extra: {
                    ifJumpWalletSelect: true,
                    account: this.ctx.identity
                }
            })
        })
    }
}

export default Bridge
