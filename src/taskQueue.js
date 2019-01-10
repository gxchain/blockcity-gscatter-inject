/**
 *  自动执行的任务队列，当上一个任务完成之后，会自动执行下一个，直到执行完为止
 */
class TaskQueue {
    constructor() {
        this.queue = []
    }

    push(obj) {
        this.queue.push(TaskQueue.itemFromJson(obj))
        if (this.queue.length === 1) {
            this.executeNext()
        }
    }

    executeNext() {
        if (this.queue.length === 0) {
            return
        }

        const latestTask = this.queue[0]
        // 执行完之后，刚才执行的任务出列，执行下一个
        latestTask(() => {
            this.queue.shift()
            this.executeNext()
        })
    }

    static itemFromJson({ callback, args, resolve, reject }) {
        return (done) => {
            callback.apply(null, args).then(res => {
                resolve(res)
                done()
            }).catch(err => {
                reject(err)
                done()
            })
        }
    }
}

export default new TaskQueue()
