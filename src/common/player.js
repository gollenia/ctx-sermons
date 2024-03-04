import React, {
	useCallback,
	useEffect,
	useRef,
	useState,
} from "@wordpress/element";

import forward from "./forward.js";
import pace from "./pace.js";
import replay from "./replay.js";
import volume from "./volume.js";
function AudioPlayer(props) {
	const { audio, cover, title, artist, album } = props;
	const audioElement = useRef(null);
	const progressRange = useRef(null);
	const [currentTime, setCurrentTime] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [showVolume, setShowVolume] = useState(false);
	const [showSpeed, setShowSpeed] = useState(false);

	const playAnimationRef = useRef(null);

	const timePercent = audioElement?.current
		? (currentTime / audioElement?.current?.duration) * 100
		: 0;

	const repeat = useCallback(() => {
		const timePercent =
			(audioElement.current.currentTime / audioElement.current.duration) * 100;
		setCurrentTime(audioElement.current.currentTime);
		playAnimationRef.current = requestAnimationFrame(repeat);

		progressRange.current?.style?.setProperty(
			"--seek-before-width",
			`${timePercent}%`,
		);
	}, []);

	useEffect(() => {
		if (isPlaying) {
			audioElement.current.play();
			playAnimationRef.current = requestAnimationFrame(repeat);

			return;
		}

		audioElement.current.pause();
		cancelAnimationFrame(playAnimationRef.current);
	}, [isPlaying, audioElement, repeat]);

	const calculateTime = (secs) => {
		if (isNaN(secs)) {
			return "0:00";
		}
		const minutes = Math.floor(secs / 60);
		const seconds = Math.floor(secs % 60);
		const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

		return `${minutes}:${returnedSeconds}`;
	};

	const onLoadedMetadata = () => {
		console.log(title, artist, album);
		navigator.mediaSession.metadata = new MediaMetadata({
			title,
			artist,
			album,
			artwork: [
				{
					sizes: "640x360",
					src: cover,
					type: "",
				},
			],
		});
	};

	return (
		<div className="ctx-sermon-audio-player">
			<audio
				ref={audioElement}
				src={audio}
				preload="metadata"
				onLoadedMetadata={onLoadedMetadata}
				onEnded={() => {
					setIsPlaying(false);
				}}
			/>

			<div>
				<input
					type="range"
					max="100"
					ref={progressRange}
					className="ctx-sermon-audio-player-progress"
					value={timePercent}
					onChange={(event) => {
						const time =
							(event.target.value / 100) * audioElement.current.duration;
						audioElement.current.currentTime = time;
					}}
				/>
			</div>
			<div className="ctx-sermon-audio-player-time">
				<span id="current-time" class="time">
					{calculateTime(currentTime)}
				</span>
				<span id="duration" class="time">
					{calculateTime(audioElement.current?.duration)}
				</span>
			</div>
			<div className="ctx-sermon-audio-player-controls">
				<div className="ctx-sermon-audio-player-buttons">
					<div className="ctx-sermon-audio-player-speed ctx-sermon-audio-player-buttons-secondary">
						<span onClick={() => setShowSpeed(!showSpeed)}>{pace}</span>
						<div
							className={`ctx-sermon-audio-player-speed-selection ${
								showSpeed ? "is-open" : ""
							}`}
						>
							<button
								onClick={() => {
									audioElement.current.playbackRate = 0.5;
									setShowSpeed(false);
								}}
								className={
									audioElement?.current?.playbackRate === 0.5 ? "active" : ""
								}
							>
								0.5x
							</button>
							<button
								onClick={() => {
									audioElement.current.playbackRate = 1;
									setShowSpeed(false);
								}}
								className={
									audioElement?.current?.playbackRate === 1 ? "active" : ""
								}
							>
								1x
							</button>
							<button
								onClick={() => {
									audioElement.current.playbackRate = 1.5;
									setShowSpeed(false);
								}}
								className={
									audioElement?.current?.playbackRate === 1.5 ? "active" : ""
								}
							>
								1.5x
							</button>
							<button
								onClick={() => {
									audioElement.current.playbackRate = 2;
									setShowSpeed(false);
								}}
								className={
									audioElement?.current?.playbackRate === 2 ? "active" : ""
								}
							>
								2x
							</button>
						</div>
					</div>

					<button
						onClick={() => {
							audioElement.current.currentTime -= 30 || 0;
						}}
						className="ctx-sermon-audio-player-buttons-secondary"
					>
						{replay}
					</button>

					<button
						onClick={() => {
							setIsPlaying(!isPlaying);
						}}
						id="play-icon"
					>
						<div className={`play-icon ${isPlaying ? "" : "play-icon-active"}`}>
							<div className="play-icon__square"></div>
							<div className="play-icon__triangle"></div>
						</div>
					</button>

					<button
						onClick={() => {
							audioElement.current.currentTime += 30;
						}}
						className="ctx-sermon-audio-player-buttons-secondary"
					>
						{forward}
					</button>
					<div
						className="ctx-sermon-audio-player-buttons-secondary ctx-sermon-audio-player-volume"
						onClick={() => setShowVolume(!showVolume)}
					>
						<span>{volume}</span>
						<div
							className={`ctx-sermon-audio-player-volume-selection ${
								showVolume ? "is-open" : ""
							}`}
						>
							<input
								type="range"
								min="0"
								max="1"
								orient="vertical"
								step="0.01"
								value={audioElement.current?.volume}
								onChange={(event) => {
									audioElement.current.volume = event.target.value;
								}}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default AudioPlayer;
