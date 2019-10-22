const {XElement, importUtil} = require('xx-element');
const {template, name} = importUtil(__filename);
const storage = require('../service/storage');

customElements.define(name, class VideoFrame extends XElement {
	static get htmlTemplate() {
		return template;
	}

	connectedCallback() {
		this.$('#help-button').addEventListener('click', () =>
			this.$('#help-text').classList.toggle('hidden'));

		this.$('#video-input').addEventListener('change', () => {
			this.$('#video').src = URL.createObjectURL(this.$('#video-input').files[0]);
			this.$('#video-input').blur();
		});

		this.$('#subtitles-input').addEventListener('change', () => {
			this.$('#subtitles').src = URL.createObjectURL(this.$('#subtitles-input').files[0]);
			this.$('#subtitles-input').blur();
		});

		this.$('#fullscreen-button').addEventListener('click', () => this.fullscreenToggle_());

		this.configGlobalKeyListener_();
	}

	configGlobalKeyListener_() {
		document.addEventListener('keydown', ({key, target}) => {
			if (target.nodeName === 'INPUT')
				return;
			this.$('#video').blur();

			switch (key) {
				case 'ArrowLeft':
					this.$('#video').currentTime = VideoFrame.shift(this.$('#video').currentTime, -10, 0, this.$('#video').duration);
					break;
				case 'ArrowRight':
					this.$('#video').currentTime = VideoFrame.shift(this.$('#video').currentTime, 10, 0, this.$('#video').duration);
					break;
				case 'ArrowDown':
				case ' ':
					if (this.$('#video').paused)
						this.$('#video').play();
					else
						this.$('#video').pause();
					break;
				case ',':
					this.$('#video').playbackRate = VideoFrame.shift(this.$('#video').playbackRate, -.25, .25, 4);
					this.displayPlaybackRate_();
					break;
				case '.':
					this.$('#video').playbackRate = VideoFrame.shift(this.$('#video').playbackRate, .25, .25, 4);
					this.displayPlaybackRate_();
					break;
				case '/':
					this.fastForwardRevertRate_ = this.fastForwardRevertRate_ || this.$('#video').playbackRate;
					this.$('#video').playbackRate = VideoFrame.shift(this.$('#video').playbackRate, 1, .25, 4);
					break;
				case 'f':
					this.fullscreenToggle_();
					break;
			}
		});

		document.addEventListener('keyup', ({key, target}) => {
			switch (key) {
				case '/':
					this.$('#video').playbackRate = this.fastForwardRevertRate_;
					this.fastForwardRevertRate_ = null;
					break;
			}
		});
	}

	async play(name) {
		this.$('video').src = await storage.videoPath(name);
	}

	showOverlay_(text, duration = 500) {
		if (this.overlayTimeout_)
			clearTimeout(this.overlayTimeout_);
		this.$('#overlay').textContent = text;
		this.$('#overlay').classList.remove('hidden');
		this.overlayTimeout_ = setTimeout(() => this.$('#overlay').classList.add('hidden'), duration);
	}

	displayPlaybackRate_() {
		this.showOverlay_('Playback Rate: ' + this.$('#video').playbackRate)
	}

	fullscreenToggle_() {
		if (document.fullscreenElement)
			document.exitFullscreen();
		else
			this.$('#video-container').requestFullscreen();
	}

	static shift(value, delta, min, max) {
		return Math.min(Math.max(value + delta, min), max);
	}
});

// todo support streaming media
