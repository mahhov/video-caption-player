const $tream = require('bs-better-stream');
const dwytpl = require('dwytpl');
const storage = require('./storage');

const $ = document.querySelector.bind(document);

let showOverlay = (text, duration = 500) => {
	if (showOverlay.timeout)
		clearTimeout(showOverlay.timeout);
	$('#overlay').textContent = text;
	$('#overlay').classList.remove('hidden');
	showOverlay.timeout = setTimeout(() => $('#overlay').classList.add('hidden'), duration);
};

$('#help-button').addEventListener('click', () => {
	$('#help-text').classList.toggle('hidden');
});

$('#video-input').addEventListener('change', () => {
	$('#video').src = URL.createObjectURL($('#video-input').files[0]);
	$('#video-input').blur();
});

$('#subtitles-input').addEventListener('change', () => {
	$('#subtitles').src = URL.createObjectURL($('#subtitles-input').files[0]);
	$('#subtitles-input').blur();
});

let displayPlaybackRate = () =>
	showOverlay('Playback Rate: ' + $('#video').playbackRate);

let fullscreenToggle = () => {
	if (document.fullscreenElement)
		document.exitFullscreen();
	else
		$('#video-container').requestFullscreen();
};
$('#fullscreen-button').addEventListener('click', fullscreenToggle);

let shift = (value, delta, min, max) =>
	Math.min(Math.max(value + delta, min), max);

document.addEventListener('keydown', ({key, target}) => {
	if (target.nodeName === 'INPUT')
		return;
	$('#video').blur();

	switch (key) {
		case 'ArrowLeft':
			$('#video').currentTime = shift($('#video').currentTime, -10, 0, $('#video').duration);
			break;
		case 'ArrowRight':
			$('#video').currentTime = shift($('#video').currentTime, 10, 0, $('#video').duration);
			break;
		case 'ArrowDown':
		case ' ':
			console.log('play/pause')
			if ($('#video').paused)
				$('#video').play();
			else
				$('#video').pause();
			break;
		case ',':
			$('#video').playbackRate = shift($('#video').playbackRate, -.25, .25, 4);
			displayPlaybackRate();
			break;
		case '.':
			$('#video').playbackRate = shift($('#video').playbackRate, .25, .25, 4);
			displayPlaybackRate();
			break;
		case 'f':
			fullscreenToggle();
			break;
	}
});

let videoList = new dwytpl.VideoList();
// todo fill with already downloaded

let syncher = new dwytpl.Syncher(videoList, storage.downloadDir);
syncher.download(10, false);

syncher.tracker.summary.each(summaryText => {
	$('#download-summary-line-one').textContent = summaryText[0];
	$('#download-summary-line-two').textContent = summaryText[1];
});

videoList.videos.each(async video => {
	let div = document.createElement('div');
	let divTop = document.createElement('div');
	let divBottom = document.createElement('div');

	divTop.textContent = video.getName_();
	video.status.stream.each(statusText => divBottom.textContent = statusText);

	div.appendChild(divTop);
	div.appendChild(divBottom);
	$('#download-list').appendChild(div);

	// let line = document.createElement('x-downloading-song-line');
	// line.videoId = video.id_;
	// line.title = video.getName_();
	// video.status.stream.each(statusText => line.status = statusText);
	// video.status.promise
	// 	.then(() => line.downloadStatus = 'true')
	// 	.catch(() => line.downloadStatus = 'false');
	// this.$('#list').appendChild(line);
	// line.addEventListener('select', () => this.selectLine_(line, video));
});

$('#download-add').addEventListener('change', () => {
	let value = $('#download-add').value;
	let id = (value.match(/v=([\w-]+)/) || value.match(/([\w-]+)/))[1];
	videoList.add(id);
});

// todo / key to fast forward while pressed
