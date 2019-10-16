const {XElement, importUtil} = require('xx-element');
const {template, name} = importUtil(__filename);

customElements.define(name, class extends XElement {
	static get htmlTemplate() {
		return template;
	}

	connectedCallback() {
		this.$('x-dir-frame').addEventListener('select-video', ({detail: name}) =>
			this.$('x-video-frame').play(name));

		this.$('x-explore-frame').addEventListener('downloaded', () =>
			this.$('x-dir-frame').refreshList());
	}
});
