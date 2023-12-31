/**
 * Use this file for JavaScript code that you want to run in the front-end
 * on posts/pages that contain this block.
 *
 * When this file is defined as the value of the `viewScript` property
 * in `block.json` it will be enqueued on the front end of the site.
 *
 * Example:
 *
 * ```js
 * {
 *   "viewScript": "file:./view.js"
 * }
 * ```
 *
 * If you're not making any changes to this file because your project doesn't need any
 * JavaScript running in the front-end, then you should delete this file and remove
 * the `viewScript` property from `block.json`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#view-script
 */

const audio = document.getElementById("audio");
const playPauseButton = document.getElementById("play-pause-button");
const volumeControl = document.getElementById("volume-control");
const progressBar = document.getElementById("progress-bar");
const currentTimeDisplay = document.getElementById("current-time");
const totalTimeDisplay = document.getElementById("total-time");

let isPlaying = false;

playPauseButton.addEventListener("click", () => {
	if (isPlaying) {
		audio.pause();
		playPauseButton.textContent = "Play";
	} else {
		audio.play();
		playPauseButton.textContent = "Pause";
	}
	isPlaying = !isPlaying;
});

volumeControl.addEventListener("input", () => {
	audio.volume = volumeControl.value;
});

audio.addEventListener("timeupdate", () => {
	const currentTime = audio.currentTime;
	const duration = audio.duration;

	const currentMinutes = Math.floor(currentTime / 60);
	const currentSeconds = Math.floor(currentTime % 60);
	const totalMinutes = Math.floor(duration / 60);
	const totalSeconds = Math.floor(duration % 60);

	currentTimeDisplay.textContent = `${currentMinutes}:${
		currentSeconds < 10 ? "0" : ""
	}${currentSeconds}`;
	totalTimeDisplay.textContent = `${totalMinutes}:${
		totalSeconds < 10 ? "0" : ""
	}${totalSeconds}`;

	const progress = (currentTime / duration) * 100;
	progressBar.style.width = `${progress}%`;
});
