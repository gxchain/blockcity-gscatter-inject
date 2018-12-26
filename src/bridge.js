import BlockCity from 'blockcity-js-sdk/index'
import adaptArgsForBridge from './adaptArgsForBridge'
import { identityGuard } from './util'

class Bridge {
    constructor(context) {
        this.ctx = context
    }

    callContract() {
        return new Promise(async (resolve, reject) => {
            try {
                await identityGuard(this.ctx.identity)
            } catch (err) {
                reject(err)
                return
            }
            const adaptedArgs = await adaptArgsForBridge('callContract', arguments, this.ctx, resolve, reject)
            BlockCity.callContract(adaptedArgs)
        })
    }

    transfer() {
        return new Promise(async (resolve, reject) => {
            try {
                await identityGuard(this.ctx.identity)
            } catch (err) {
                reject(err)
                return
            }
            const adaptedArgs = await adaptArgsForBridge('transfer', arguments, this.ctx, resolve, reject)
            BlockCity.callContract(adaptedArgs)
        })
    }

    vote() {
        return new Promise(async (resolve, reject) => {
            try {
                await identityGuard(this.ctx.identity)
            } catch (err) {
                reject(err)
                return
            }
            await identityGuard(this.ctx.identity)
            const adaptedArgs = await adaptArgsForBridge('vote', arguments, this.ctx, resolve, reject)
            BlockCity.callContract(adaptedArgs)
        })
    }
}

export default Bridge
