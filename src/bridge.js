import { callContract } from './nativeService'
import adaptArgsForBridge from './adaptArgsForBridge'
import Error from './Error'

class Bridge {
    constructor(context = {}) {
        this.ctx = context
    }

    callContract() {
        return new Promise(async (resolve, reject) => {
            try {
                await this._identityGuard(this.ctx.identity)
            } catch (err) {
                reject(err)
                return
            }
            const adaptedArgs = await adaptArgsForBridge('callContract', arguments, this.ctx, resolve, reject)
            callContract(adaptedArgs)
        })
    }

    transfer() {
        return new Promise(async (resolve, reject) => {
            try {
                await this._identityGuard(this.ctx.identity)
            } catch (err) {
                reject(err)
                return
            }
            const adaptedArgs = await adaptArgsForBridge('transfer', arguments, this.ctx, resolve, reject)
            callContract(adaptedArgs)
        })
    }

    vote() {
        return new Promise(async (resolve, reject) => {
            try {
                await this._identityGuard(this.ctx.identity)
            } catch (err) {
                reject(err)
                return
            }
            const adaptedArgs = await adaptArgsForBridge('vote', arguments, this.ctx, resolve, reject)
            callContract(adaptedArgs)
        })
    }

    getArbitrarySignature() {
        return new Promise(async (resolve, reject) => {
            try {
                await this._identityGuard(this.ctx.identity)
            } catch (err) {
                reject(err)
                return
            }
            const adaptedArgs = await adaptArgsForBridge('getArbitrarySignature', arguments, this.ctx, resolve, reject)
            callContract(adaptedArgs)
        })
    }

    async _identityGuard(identity) {
        if (!identity) {
            await this._noIdentity()
            throw Error.noIdentityError()
        }
    }

    _noIdentity() {
        return new Promise(async (resolve, reject) => {
            const adaptedArgs = await adaptArgsForBridge('_noIdentity', arguments, this.ctx, resolve, reject)
            callContract(adaptedArgs)
        })
    }
}

export default Bridge
