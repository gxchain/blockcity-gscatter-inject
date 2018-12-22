/**
 * 全局store
 */
class Store {
    constructor() {
        this.state = {
            witness: 'ws://47.96.164.78:28090'
        }
    }

    set(key, value) {
        return this.state[key] = value
    }

    get(key) {
        return this.state[key]
    }
}

export default new Store()
