import BlockCity from 'blockcity-js-sdk'

class Bridge {
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
}

export default new Bridge()
