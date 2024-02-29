import { expect, test, describe } from "vitest";
import { autoLitWrapperOld } from "./auto-list-wrapper-old";
import { ElementNode } from "ultrahtml";

const filter = (node: ElementNode) => ("name" in node ? node.name.startsWith("kpn-") : false);

describe("autoLitWrapper", () => {
  test("simple", async () => {
    const template = `<kpn-title id="title" :foo="bar">Hello world!</kpn-title>`;
    const string = await autoLitWrapperOld(template, "LitWrapper", filter);
    expect(string).toMatchSnapshot();
  });

  test("complex", async () => {
    const template = `
    <kpn-title v-if="true" id="title" :foo="bar > 1 ? 2 : 1" bind:test="test">
        <span>Hello world!</span>
        <img src="src" />
    </kpn-title>
    `;

    const string = await autoLitWrapperOld(template, "LitWrapper", filter);
    expect(string).toMatchSnapshot();
  });

  test("for", async () => {
    const template = `
      <kpn-list-item v-for="item in items" :key="item.id">
        <kpn-title id="title" :foo="bar">Hello world!</kpn-title>
      </kpn-list-item>
    `;

    const string = await autoLitWrapperOld(template, "LitWrapper", filter);
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

    const string = await autoLitWrapperOld(template, "LitWrapper", filter);
    expect(string).toMatchSnapshot();
  });
});
