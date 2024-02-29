import { parse, walk, ELEMENT_NODE, render } from "ultrahtml";
import type { ElementNode, Node } from "ultrahtml";

const V_FOR_DIRECTIVE = "v-for";
const V_FOR_KEY_DIRECTIVE = ":key";
const V_IF_DIRECTIVE = "v-if";
const V_ELSE_IF_DIRECTIVE = "v-else-if";
const V_ELSE_DIRECTIVE = "v-else";

function transferDirectiveToWrapper(node: Node, wrapper: Node, directive: string) {
  if (directive in node.attributes) {
    wrapper.attributes[directive] = node.attributes[directive];

    delete node.attributes[directive];
  }
}

export async function autoLitWrapperOld(template: string, elementName: string, filter: (node: ElementNode) => boolean) {
  const ast = parse(template);

  await walk(ast, (node) => {
    if (node?.attributes) {
      delete node.attributes[""];
    }

    if (node.type !== ELEMENT_NODE || !filter(node)) {
      return;
    }

    const wrapper: Node = {
      name: elementName,
      type: ELEMENT_NODE,
      parent: node.parent,
      children: [node],
      attributes: {},
      loc: node.loc
    };

    if (node.attributes[V_FOR_DIRECTIVE]) {
      transferDirectiveToWrapper(node, wrapper, V_FOR_DIRECTIVE);
      transferDirectiveToWrapper(node, wrapper, V_FOR_KEY_DIRECTIVE);
    }

    transferDirectiveToWrapper(node, wrapper, V_IF_DIRECTIVE);
    transferDirectiveToWrapper(node, wrapper, V_ELSE_IF_DIRECTIVE);
    transferDirectiveToWrapper(node, wrapper, V_ELSE_DIRECTIVE);

    delete node.attributes[""];

    node.parent.children.splice(node.parent.children.indexOf(node), 1, wrapper);
  });

  const transformedCode = await render(ast);
  return transformedCode;
}
