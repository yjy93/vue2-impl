/**
 * @author: 半醉半醒半浮生
 * @age: 永远18岁的美少年
 * @Email： Genejob@163.com
 * @date: 2020-10-19 13:20:02
 * @description: Vue 中重写 数组的方法
 */

let oldArrayProtoMethods = Array.prototype;

// 不能直接改写数组原有的方法, 不可靠, 因为只有被Vue控制的数组才需要改写
export let arrayMethods = Object.create(Array.prototype)

let methods = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'reverse',
    'sort'
]

methods.forEach((method) => { // AOP 切片编程
    arrayMethods[method] = function (...args) { // 重写数组方法
        // 有可能用户新增的数据是对象格式, 也需要进行拦截
        let result = oldArrayProtoMethods[method].call(this, ...args)
        let inserted; // 要插入的数据
        let ob = this.__ob__
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args
                break;
            case 'splice': // splice(0,1,xxx)
                // 把splice(0,1,xxx) 中 0,1 参数截取掉, 第三个 xxx 才是要插入的数据
                inserted = args.slice(2)
            default:
                break;
        }

        if (inserted) { // observeArray()
            ob.observeArray(inserted)
        }
        // 有
        return result;
    }
})

