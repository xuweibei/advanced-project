import { isSameVnode } from '.'

export function createElm(vnode) {
  let { tag, data, children, text } = vnode
  if (typeof tag === 'string') {
    vnode.el = document.createElement(tag)
    patchProps(vnode.el, {}, data)
    children.forEach(child => {
      createElm(child) && vnode.el.appendChild(createElm(child))
    })
  } else {
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}
export function patchProps(el, oldProps = {}, props = {}) {
  let oldStyles = oldProps.style || {}
  let newStyles = props.style || {}
  for (let key in oldStyles) {
    if (!newStyles[key]) {
      el.style[key] = ''
    }
  }

  for (let key in oldProps) {
    if (!props[key]) {
      el.removeAttribute(key)
    }
  }

  for (let key in props) {
    if (key === 'style') {
      for (let styleName in props.style) {
        el.style[styleName] = props.style[styleName]
      }
    } else {
      el.setAttribute(key, props[key])
    }
  }
}

export function patch(oldVNode, vnode) {
  const isRealElement = oldVNode.nodeType
  if (isRealElement) {
    const elm = oldVNode
    const parentElm = elm.parentNode

    const newElm = createElm(vnode)
    parentElm.insertBefore(newElm, elm.nextSibling)
    parentElm.removeChild(elm)
    return newElm
  } else {
    return patchVnode(oldVNode, vnode)
  }
}
function patchVnode(oldVNode, vnode) {
  if (!isSameVnode(oldVNode, vnode)) {
    //如果节点不一样
    let el = createElm(vnode)
    oldVNode.el.parentNode.replaceChild(el, oldVNode.el)
    return el
  }
  let el = (vnode.el = oldVNode.el)
  if (!oldVNode.tag) {
    //文本的情况
    if (oldVNode.text !== vnode.text) {
      oldVNode.el.textContent = vnode.text
    }
  }
  //节点一样，尽量复用
  patchProps(el, oldVNode.data, vnode.data)

  let oldChildren = oldVNode.children || []
  let newChildren = vnode.children || []

  if (oldChildren.length > 0 && newChildren.length > 0) {
    updateChildren(el, oldChildren, newChildren)
  } else if (newChildren.length > 0) {
    mountChildren(el, newChildren)
  } else if (oldChildren > 0) {
    el.innerHTML = ''
  }
  return el
}

function mountChildren(el, newChildren) {
  for (let i = 0; i < newChildren.length; i++) {
    let child = newChildren[i]
    el.appendChild(createElm(child))
  }
}

function updateChildren(el, oldChildren, newChildren) {
  let oldStartIndex = 0
  let newStartIndex = 0

  let oldEndIndex = oldChildren.length - 1
  let newEndIndex = newChildren.length - 1

  let oldStartVnode = oldChildren[0]
  let newStartVnode = newChildren[0]

  let oldEndVnode = oldChildren[oldEndIndex]
  let newEndVnode = newChildren[newEndIndex]

  function makeIndexByKey(children) {
    let map = {}
    children.forEach((item, index) => {
      map[item.key] = index
    })
    return map
  }

  let map = makeIndexByKey(oldChildren)

  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if (!oldStartVnode) {
      oldStartVnode = oldChildren[++oldStartIndex]
    } else if (!oldEndVnode) {
      oldEndVnode = oldChildren[--oldEndIndex]
    } else if (isSameVnode(oldStartVnode, newStartVnode)) {
      patchVnode(oldStartVnode, newStartVnode)
      oldStartVnode = oldChildren[++oldStartIndex]
      newStartVnode = newChildren[++newStartIndex]
    } else if (isSameVnode(oldEndVnode, newEndVnode)) {
      patchVnode(oldEndVnode, newEndVnode)
      oldEndVnode = oldChildren[--oldEndIndex]
      newEndVnode = newChildren[--newEndIndex]
    } else if (isSameVnode(oldEndVnode, newStartVnode)) {
      patchVnode(oldEndVnode, newStartVnode)
      el.insertBefore(oldEndVnode.el, oldStartVnode.el)
      oldEndVnode = oldChildren[--oldEndIndex]
      newStartVnode = newChildren[++newStartIndex]
    } else if (isSameVnode(oldStartVnode, newEndVnode)) {
      patchVnode(oldStartVnode, newEndVnode)
      el.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling)
      oldStartVnode = oldChildren[++oldStartIndex]
      newEndVnode = newChildren[--newEndIndex]
    } else {
      let moveIndex = map[newStartVnode.key]
      if (moveIndex !== undefined) {
        let moveVnode = oldChildren[moveIndex]
        el.insertBefore(moveVnode.el, oldStartVnode.el)
        oldChildren[moveIndex] = undefined
        patchVnode(moveVnode, newStartVnode)
      } else {
        el.insertBefore(createElm(newStartVnode), oldStartVnode.el)
      }
      newStartVnode = newChildren[++newStartIndex]
    }
  }

  if (newStartIndex <= newEndIndex) {
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      let childEl = createElm(newChildren[i])
      let anchor = newChildren[newEndIndex + 1] ? newChildren[newEndIndex + 1].el : null

      el.insertBefore(childEl, anchor)
    }
  }

  if (oldStartIndex <= oldEndIndex) {
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      if (oldChildren[i]) {
        let childEl = oldChildren[i].el
        el.removeChild(childEl)
      }
    }
  }

  console.log(oldStartVnode, newStartVnode, oldEndVnode, newEndVnode)
}
