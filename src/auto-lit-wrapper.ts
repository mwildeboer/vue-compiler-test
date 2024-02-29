import { ElementNode, NodeTypes, TemplateChildNode, baseParse as parse, transform } from "@vue/compiler-core";
import { stringifyNode } from "./stringify-node";

const V_FOR_DIRECTIVE = "v-for";
const V_FOR_KEY_DIRECTIVE = ":key";
const V_IF_DIRECTIVE = "v-if";
const V_ELSE_IF_DIRECTIVE = "v-else-if";
const V_ELSE_DIRECTIVE = "v-else";

const directives = [V_FOR_DIRECTIVE, V_FOR_KEY_DIRECTIVE, V_IF_DIRECTIVE, V_ELSE_IF_DIRECTIVE, V_ELSE_DIRECTIVE];

export function autoLitWrapper(template: string, elementName: string, filter: (node: TemplateChildNode) => boolean) {
  const ast = parse(template);

  transform(ast, {
    nodeTransforms: [
      (node, context) => {
        if (
          node.type === NodeTypes.ELEMENT &&
          filter(node) &&
          (context.parent as ElementNode | null)?.tag !== elementName
        ) {
          context.replaceNode(
            Object.assign({}, node, {
              tag: elementName,
              props: node.props.filter(
                (prop) => prop.type === NodeTypes.DIRECTIVE && directives.includes(prop.rawName!)
              ),
              children: [
                {
                  ...node,
                  props: node.props.filter((prop) =>
                    prop.type === NodeTypes.DIRECTIVE ? !directives.includes(prop.rawName!) : true
                  )
                }
              ]
            })
          );
        }
      }
    ]
  });

  return stringifyNode(ast);
}
