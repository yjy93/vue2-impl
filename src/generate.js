const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

function genProps(attrs) { // 生成标签的属性对象
    let str = ''
    for (let i = 0; i < attrs.length; i++) {
        let attr = attrs[i]; //
        if (attrs.name === 'style') {
            let obj = {}
            attr.value.split(';').forEach((item) => {
                let [key, value] = item.split(':')
                obj[key] = value
            })
            attr.value = obj
        }
        str += `${attr.name}:${JSON.stringify(attr.value)},` // {a:'aaa',a:1,b:2}
    }
    return `{${str.slice(0, -1)}}`
}

function genChildren(el) { // 生成当前节点的子节点
    // 递归生成孩子节点
    let children = el.children
    if (children) {
        return children.map((child) => gen(child)).join(',')
    }
}

function gen(node) { // 区分 是元素 还是 文本
    if (node.type == 1) {
        return generate(node);
    } else {
        // 文本 逻辑不能用 _c 来处理
        // 有 {{}} 文本, 普通文本, 混合文本 {{aa}} aaa {{{bbb}}} ccc
        let text = node.text
        if (defaultTagRE.test(text)) {
            // 如果匹配到了, 则是带有 {{}} 的文本
            let tokens = [];
            let match;
            let index = 0;
            let lastIndex = defaultTagRE.lastIndex = 0;
            while (match = defaultTagRE.exec(text)) {
                index = match.index;
                if (index > lastIndex) {
                    tokens.push(JSON.stringify(text.slice(lastIndex, index)))
                }
                tokens.push(`_s(${match[1].trim()})`);
                lastIndex = index + match[0].length
            }
            if (lastIndex < text.length) {
                tokens.push(JSON.stringify(text.slice(lastIndex)))
            }
            return `_v(${tokens.join('+')})`
        } else {
            return `_v(${JSON.stringify(text)})`
        }
    }
}

export function generate(el) {
    // 根据这个 ast 语法树, 转换成 render的js 代码
    let children = genChildren(el)
    let code = `_c('${el.tag}',${
        el.attrs.length ? genProps(el.attrs) : 'undefined'
        }${
        children ? (',' + children) : ''
        })`
    return code;
}
