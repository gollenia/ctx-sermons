import fileSize from "@contexis/filesize";
import { useState } from "@wordpress/element";
import AudioPlayer from "./player.js";

("@contexis/filesize");

const Modal = ({ sermon, setSermon, altImage }) => {
	const [loading, setLoading] = useState(true);

	const backdropClickHandler = (event) => {
		event.stopPropagation();
		if (event.target.classList.contains("ctx-sermon-player-modal")) {
			setSermon(null);
		}
	};

	const browserLocale = navigator.language || navigator.userLanguage;

	const size = fileSize(sermon?.audio?.filesize);

	const fileSizeString = new Intl.NumberFormat(browserLocale, {
		style: "unit",
		unit: size.unit,
		unitDisplay: "short",
	}).format(size.value);

	console.log(altImage);

	return (
		<div
			className={`ctx-sermon-player-modal ${sermon ? "is-open" : ""}`}
			onClick={(event) => {
				backdropClickHandler(event);
			}}
		>
			<div className="window">
				{sermon && sermon.audio && (
					<div className="content">
						<div
							className={`header ${
								sermon?.image?.large || altImage?.large
									? "has-image"
									: "has-no-image"
							}`}
						>
							{(sermon?.image?.large || altImage?.large) && (
								<img
									src={sermon?.image?.large || altImage?.large?.source_url}
								/>
							)}
							<span onClick={() => setSermon(null)} className="close">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									height="24"
									viewBox="0 -960 960 960"
									width="24"
								>
									<path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
								</svg>
							</span>
						</div>
						<h3>{sermon.title}</h3>
						<p className="preacher">{sermon.speaker[0].name}</p>
						<AudioPlayer
							audio={sermon.audio.url}
							title={sermon?.title}
							artist={sermon.speaker[0]?.name}
							album={sermon.series[0]?.title}
							cover={
								sermon.image?.medium || altImage?.thumbnail.source_url || ""
							}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default Modal;
