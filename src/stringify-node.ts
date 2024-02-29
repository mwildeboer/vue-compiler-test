import { AttributeNode, DirectiveNode, NodeTypes, RootNode, TemplateChildNode } from "@vue/compiler-core";

function attrString(attrs: Array<AttributeNode | DirectiveNode>) {
  const buff = attrs.map((attr) => attr.loc.source);
  return !buff.length ? "" : " " + buff.join(" ");
}

function stringifier(buff: string, node: TemplateChildNode): string {
  switch (node.type) {
    case NodeTypes.ELEMENT:
      buff += "<" + node.tag + (node.props ? attrString(node.props) : "") + (node.isSelfClosing ? " />" : ">");
      if (node.isSelfClosing) {
        return buff;
      }
      return buff + node.children.reduce(stringifier, "") + "</" + node.tag + ">";
    case NodeTypes.TEXT:
      return buff + node.content;
    case NodeTypes.COMMENT:
      return (buff += "<!--" + node.content + "-->");
    default:
      return "";
  }
}

export function stringifyNode(rootNode: RootNode) {
  return rootNode.children.reduce((accumulator, child) => accumulator + stringifier("", child), "");
}
