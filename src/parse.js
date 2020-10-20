const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; // aa-aa
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; //aa:aa
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 可以匹配到标签名  [1]
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); //[0] 标签的结束名字
//    style="xxx"   style='xxx'  style=xxx
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
const startTagClose = /^\s*(\/?)>/;

// 把这个模板转换成 AST 语法树

/*
    "<div id="app">
        <div style="color:red;">
            <span>{{name}}</span>
        </div>
    </div>"
*/

export function parseHTML(html) { // 解析模板
  // 创建 AST 语法树
  function createASTElement(tag, attrs) { // Vue3 里面支持多个根元素,  vue2 中只有一个根节点
    return {
      tag,
      type: 1,
      children: [],
      attrs,
      parent: null
    }
  }

// 解析 html 模板
  let root = null;
  let currentParent;
  let stack = []

  // 根据开始标签,结束标签, 文本内容  生成一个 AST 语法树
  function start(tagName, attrs) {
    let element = createASTElement(tagName, attrs)
    if (!root) { // 如果没有根元素
      root = element
    }
    currentParent = element
    stack.push(element)
  }

  function end(tagName) {
    let element = stack.pop()
    currentParent = stack[stack.length - 1]
    if (currentParent) {
      element.parent = currentParent
      currentParent.children.push(element)
    }
  }

  function chars(text) {
    text = text.replace(/\s/g, '')
    if (text) {
      currentParent.children.push({
        type: 3, // type 3 表示文本
        text,
      })
    }
  }

  function advance(n) { // 解析完当前一个字符串, 删除当前字符串
    html = html.substring(n)
  }

  function parseStartTag() { // 解析开始标签
    const start = html.match(startTagOpen)
    if (start) {
      let match = {
        tagName: start[1],
        attrs: []
      };
      advance(start[0].length) // 获取元素
      // 查找属性
      let end, attr
      // 如果不是 开始标签的结尾, 就一直解析
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length)
        match.attrs.push({name: attr[1], value: attr[3] || attr[4] || attr[5] || true})
      }
      if (end) {
        advance(end[0].length);
        return match
      }
    }
  }

  while (html) {
    let textEnd = html.indexOf('<')
    if (textEnd == 0) {
      let startTagMatch = parseStartTag();
      if (startTagMatch) { // 如果还是开始标签, 则继续
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue;
      }
      // 结束标签
      let endTagMatch = html.match(endTag)
      if (endTagMatch) { // 匹配结尾标签
        advance(endTagMatch[0].length) // 删除结尾标签
        end(endTagMatch[1])
        continue
      }
    }

    /*
    "
        <div style="color:red;">
            <span>{{name}}</span>
        </div>
    </div>"
*/
    let text;
    if (textEnd > 0) { // 开始解析文本
      text = html.substring(0, textEnd)
    }
    if (text) {
      advance(text.length)
      chars(text)
    }
  }
  return root
}
