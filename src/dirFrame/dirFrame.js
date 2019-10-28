const {XElement, importUtil} = require('xx-element');
const {template, name} = importUtil(__filename);
const storage = require('../service/storage');
const {shell} = require('electron');

customElements.define(name, class extends XElement {
	static get htmlTemplate() {
		return template;
	}

	connectedCallback() {
		this.refreshList();
		this.$('#link').addEventListener('click', () => shell.openExternal(storage.downloadDir));
		this.$('#filter-input').addEventListener('input', () => this.filterList_())
	}

	async refreshList() {
		this.clearChildren('#list');
		let videoList = await storage.videoList;
		this.$('#count').textContent = videoList.length;
		videoList.map(name => {
			let line = document.createElement('div');
			line.addEventListener('click', () => {
				[...this.$('#list').children].forEach(line => line.classList.remove('selected'));
				line.classList.add('selected');
				this.emit('select-video', name)
			});

			let removeButton = document.createElement('button');
			removeButton.textContent = 'X'; // todo proper styling on hover
			removeButton.addEventListener('click', async e => {
				e.stopPropagation();
				await storage.removeVideo(name);
				this.refreshList();
			});
			line.appendChild(removeButton);

			let text = document.createElement('span');
			text.textContent = name;
			line.appendChild(text);

			this.$('#list').appendChild(line);
		});
		this.filterList_();
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
