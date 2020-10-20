import {parseHTML} from "../parse"
import {generate} from '../generate'

export function compileToFunctions(template) {
  let ast = parseHTML(template) // 解析 HTML模板

  //
  let code = generate(ast) // 根据 ast 语法树生成代码

}




