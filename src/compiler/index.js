import {parseHTML} from "../parse"
import {generate} from '../generate'

export function compileToFunctions(template) {
    let ast = parseHTML(template) // 解析 HTML模板

    //
    let code = generate(ast) // 根据 ast 语法树生成代码

    // 此时 render 方法, 调用的时候, 给了一个 vm 实例, 则 code中的代码会从 vm 上查找到属性或值
    let render = `with(this){return ${code}}`
    let fn = new Function(render); // 相当于把字符串变成一个函数
    return fn
}




