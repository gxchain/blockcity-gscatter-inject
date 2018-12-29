/**
 * copy from blockcity
 */
const methods = {}
var methodID = 0

window.nativeCallback = function (mId) {
    var args = Array.prototype.slice.call(arguments, 1)
    const handledArgs = args.map(arg => {
        try {
            return JSON.parse(decodeURIComponent(arg))
        } catch (err) {
            return arg
        }
    })
    typeof methods[mId] === 'function' && methods[mId].apply(this, handledArgs)
}

function callBridge(method, params, callback) {
    const schema = 'native'
    var mId = methodID++
    var url_params = ''
    methods[mId] = function () {
        typeof callback === 'function' && callback.apply(this, arguments)
        if (methods[mId]) {
            try {
                delete methods[mId]
            } catch (err) {
                methods[mId] = null
            }
        }
    }
    if (typeof (params) !== 'object') {
        params = {}
    }
    params._mId = mId
    for (var k in params) {
        url_params += ((url_params.indexOf('=') != -1) ? '&' : '') + k + '=' + encodeURI(params[k])
    }
    var url = schema + '://' + method + '?' + url_params
    var iFrame
    iFrame = document.createElement('iframe')
    iFrame.setAttribute('src', url)
    iFrame.setAttribute('style', 'display:none;')
    iFrame.setAttribute('height', '0px')
    iFrame.setAttribute('width', '0px')
    iFrame.setAttribute('frameborder', '0')
    document.body.appendChild(iFrame)
    iFrame.parentNode.removeChild(iFrame)
    iFrame = null
}

export function callContract({ contractName = '', methodName = '', methodParams = {}, type, extra, amount = {}, success, fail, cancel }) {
    methodParams = JSON.stringify(methodParams);
    amount = JSON.stringify(amount);

    const params = {
        contract_name: contractName,
        amount: amount,
        method_name: methodName,
        params: methodParams
    }

    if (!!type) {
        params.type = type;
    }

    if (!!extra) {
        params.extra = JSON.stringify(extra);
    }

    callBridge('callContract', params, function (result) {
        switch (parseInt(result.code)) {
            case 0:
                cancel && cancel(result);
                break;
            case 1:
                success && success(result);
                break;
            default:
                fail && fail(result);
        }
    });
}

export function getIdentity() {
    return new Promise(resolve => {
        callBridge('getIdentity', {}, (account) => {
            resolve(account ? {
                'hash': '',
                'publicKey': '',
                'name': '',
                'kyc': false,
                'accounts': [{
                    authority: 'active',
                    blockchain: 'gxc',
                    name: account
                }]
            } : null)
        })
    })
}

export function getChainId() {
    return new Promise(resolve => {
        callBridge('getChainId', {}, (chainId) => {
            resolve(chainId)
        })
    })
}
