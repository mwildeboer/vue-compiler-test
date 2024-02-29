import { expect, test, describe } from "vitest";
import { autoLitWrapper } from "./auto-lit-wrapper";
import { TemplateChildNode } from "@vue/compiler-core";

const filter = (node: TemplateChildNode) => ("tag" in node ? node.tag.startsWith("kpn-") : false);

describe("autoLitWrapper", () => {
  test("simple", async () => {
    const template = `<kpn-title id="title" :foo="bar">Hello world!</kpn-title>`;
    const string = await autoLitWrapper(template, "LitWrapper", filter);
    expect(string).toMatchSnapshot();
  });

  test("complex", async () => {
    const template = `
    <kpn-title v-if="true" id="title" :foo="bar > 1 ? 2 : 1" bind:test="test">
        <span>Hello world!</span>
        <img src="src" />
    </kpn-title>
    `;

    const string = await autoLitWrapper(template, "LitWrapper", filter);
    expect(string).toMatchSnapshot();
  });

  test("for", async () => {
    const template = `
      <kpn-list-item v-for="item in items" :key="item.id">
        <kpn-title id="title" :foo="bar">Hello world!</kpn-title>
      </kpn-list-item>
    `;

    const string = await autoLitWrapper(template, "LitWrapper", filter);
    expect(string).toMatchSnapshot();
  });

  test("v-if and v-else", async () => {
    const template = `
      <kpn-container v-if="true">
        <kpn-title id="title" :foo="bar">Hello world!</kpn-title>
      </kpn-container>
      <kpn-container v-else>
        <kpn-title id="title" :foo="bar">Hello world 2!</kpn-title>
      </kpn-container>
    `;

    const string = await autoLitWrapper(template, "LitWrapper", filter);
    expect(string).toMatchSnapshot();
  });
});
