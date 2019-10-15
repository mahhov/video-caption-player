const {XElement, importUtil} = require('xx-element');
const {template, name} = importUtil(__filename);
const storage = require('../service/storage');

customElements.define(name, class extends XElement {
	static get htmlTemplate() {
		return template;
	}

	connectedCallback() {
		this.refreshList();
		this.$('#filter-input').addEventListener('input', () => this.filterList_())
	}

	async refreshList() {
		this.clearChildren('#list');
		let videoList = await storage.videoList;
		this.$('#count').textContent = videoList.length;
		videoList.map(name => {
			let line = document.createElement('div');
			line.textContent = name;
			line.addEventListener('click', () =>
				this.emit('select-video', name));
			this.$('#list').appendChild(line);
		})
	}

	filterList_() {
		const charFilterRe = /[^a-z\d]/g;
		let filterWords = this.$('#filter-input').value.toLowerCase().split(charFilterRe);

		this.$$('#list > div').forEach(line => {
			let lineText = line.textContent.toLowerCase().replace(charFilterRe, '');
			line.classList.toggle('hidden', !filterWords.every(word => lineText.includes(word)))
		});
	}
});
