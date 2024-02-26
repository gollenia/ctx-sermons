import React, {
	useCallback,
	useEffect,
	useRef,
	useState,
} from "@wordpress/element";

import "./style.scss";

function AudioPlayer(props) {
	const { audio } = props;
	const audioElement = useRef(null);
	const progressRange = useRef(null);
	const [currentTime, setCurrentTime] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [showVolume, setShowVolume] = useState(false);

	const playAnimationRef = useRef(null);

	const timePercent = audioElement?.current
		? (currentTime / audioElement?.current?.duration) * 100
		: 0;

	const repeat = useCallback(() => {
		const timePercent =
			(audioElement.current.currentTime / audioElement.current.duration) * 100;
		setCurrentTime(audioElement.current.currentTime);
		playAnimationRef.current = requestAnimationFrame(repeat);
		console.log(progressRange);
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
		console.log(audioElement.current.duration);
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
			<span id="current-time" class="time">
				{calculateTime(currentTime)}
			</span>
			<button
				onClick={() => {
					setShowVolume(!showVolume);
				}}
				id="volume-icon"
			>
				VOL
			</button>
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
			<span id="duration" class="time">
				{calculateTime(audioElement.current?.duration)}
			</span>
			<div
				className={`ctx-sermon-audio-player-volume ${
					showVolume ? "is-open" : ""
				}`}
			>
				<input
					type="range"
					id="volume-slider"
					onChange={(event) => {
						audioElement.current.volume = event.target.value / 100;
					}}
					max="100"
					value="100"
				/>
			</div>
			<output id="volume-output">100</output>
			<button id="mute-icon"></button>
		</div>
	);
}

export default AudioPlayer;
