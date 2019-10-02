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
