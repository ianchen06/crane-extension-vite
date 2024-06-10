export default class HelloWorld extends HTMLElement {
  connectedCallback() {
    this.innerHTML = "hello, world!";
  }
}
