const {XElement, importUtil} = require('xx-element');
const {template, name} = importUtil(__filename);
const dwytpl = require('dwytpl');
const storage = require('../service/storage');

customElements.define(name, class extends XElement {
	static get htmlTemplate() {
		return template;
	}

	connectedCallback() {
		this.downloadQueue_ = new dwytpl.VideoList();
		this.downloadQueue_.videos.each(video => {
			let line = document.createElement('div');
			video.status.stream.each(statusText => line.textContent = `${video.getName_()} - ${statusText}`);
			video.status.promise
				.then(() => line.classList.add('succeeded'))
				.catch(() => line.classList.add('failed'))
				.finally(() => {
					storage.videoAdded();
					this.emit('downloaded')
				});
			this.$('#download-list').appendChild(line);
		});

		this.syncher_ = new dwytpl.Syncher(this.downloadQueue_, storage.downloadDir);
		this.syncher_.download(10, false);

		this.$('#search-input').addEventListener('keydown', ({key}) => {
			if (key === 'Enter')
				this.query_(this.$('#search-input').value);
		});

		this.$('#video-download-input').addEventListener('keydown', ({key}) => {
			if (key === 'Enter')
				this.downloadVideo_(this.$('#video-download-input').value);
		});
	}

	query_(query) {
		this.clearChildren('#search-list');
		if (!query)
			return;

		let search = new dwytpl.Search();
		search.query(query);
		search.videos.each(video => {
			let line = document.createElement('div');
			line.textContent = video.getName_();
			line.addEventListener('click', () => this.downloadQueue_.add(video.id_));
			this.$('#search-list').appendChild(line);
		});
	}

	downloadVideo_(videoId) {
		if (!videoId)
			return;
		this.downloadQueue_.add(videoId);
	}
});
