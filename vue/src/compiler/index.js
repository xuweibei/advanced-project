import { parseHTML } from './parse';

export function compileToFunction(template) {
  // console.log(template);
  const ast = parseHTML(template);
  let code = codegen(ast);
  code = `with(this){return ${code}}`;
  return new Function(code);
}
function codegen(ast) {
  let children = genChildren(ast.children);
  let code = `_c('${ast.tag}',${
    ast.attrs.length > 0 ? getProps(ast.attrs) : 'null'
  }${ast.children.length > 0 ? `,${children}` : ''})`;
  return code;
}

function getProps(attrs) {
  let str = '';
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i];
    if (attr.name === 'style') {
      let obj = {};
      attr.value.split(';').forEach((item) => {
        let [key, value] = item.split(':');
        obj[key] = value;
        attr.value = obj;
      });
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`;
  }
  return `{${str.slice(0, -1)}}`;
}

function genChildren(children) {
  return children && children.map((child) => gen(child)).join(',');
}

function gen(node) {
  if (node.type === 1) {
    return codegen(node);
  } else {
    let text = node.text;
    const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // {{ asdsadsa }}  匹配到的内容就是我们表达式的变量
    if (!defaultTagRE.test(text)) {
      return `_v(${JSON.stringify(text)})`;
    } else {
      let tokens = [];
      let match;
      defaultTagRE.lastIndex = 0;
      let lastIndex = 0;
      while ((match = defaultTagRE.exec(text))) {
        let index = match.index;
        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        }
        tokens.push(`_s(${match[1].trim()})`);
        lastIndex = index + match[0].length;
      }
      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }
      return `_v(${tokens.join('+')})`;
    }
  }
}
