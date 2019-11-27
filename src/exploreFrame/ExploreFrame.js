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
			video.status.promise
				.then(() => line.classList.add('succeeded'))
				.catch(() => line.classList.add('failed'))
				.finally(() => {
					storage.videoAdded();
					this.emit('downloaded')
				});

			let removeButton = document.createElement('button');
			removeButton.textContent = 'X';
			removeButton.addEventListener('click', async () => {
				video.stopDownload();
				line.remove();
			});
			line.appendChild(removeButton);

			let text = document.createElement('span');
			video.status.stream.each(statusText => text.textContent = `${video.numberedFileName} - ${statusText}`);
			line.appendChild(text);

			this.$('#download-list').appendChild(line);
		});

		this.syncher_ = new dwytpl.Syncher(this.downloadQueue_, storage.downloadDir);
		this.syncher_.download(10, false);

		this.$('#search-input').addEventListener('keydown', ({key}) => {
			if (key === 'Enter')
				this.query_(this.$('#search-input').value);
		});

		this.$('#download-all-button').addEventListener('click', () => {
			if (this.search_)
				this.search_.videos.each(video => this.downloadQueue_.add(video.id));
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

		this.search_ = new dwytpl.Search();
		this.search_.query(query);
		this.search_.videos.each(video => {
			let line = document.createElement('div');

			let img = document.createElement('img');
			img.src = video.thumbnail;
			line.appendChild(img);

			let text = document.createElement('span');
			text.textContent = video.numberedFileName.replace(/_/g, ' ');
			line.appendChild(text);

			this.$('#search-list').appendChild(line);
			line.addEventListener('click', () => this.downloadQueue_.add(video.id));
		});
	}

	downloadVideo_(videoId) {
		if (!videoId)
			return;
		this.downloadQueue_.add(videoId);
	}
});
