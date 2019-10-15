const {XElement, importUtil} = require('xx-element');
const {template, name} = importUtil(__filename);
const storage = require('../service/storage');

customElements.define(name, class extends XElement {
	static get htmlTemplate() {
		return template;
	}

	async play(name) {
		this.$('video').src = await storage.videoPath(name);
	}
});
