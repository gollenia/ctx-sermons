import fileSize from "@contexis/filesize";
import apiFetch from "@wordpress/api-fetch";
import { useEffect, useState } from "@wordpress/element";
import AudioPlayer from "./../../common/player.js";
("@contexis/filesize");

const Modal = ({ id }) => {
	const [sermon, setSermon] = useState(null);
	const [loading, setLoading] = useState(true);

	const backdropClickHandler = (event) => {
		event.stopPropagation();
	};

	useEffect(() => {
		if (!id) {
			return;
		}
		setLoading(true);
		apiFetch({
			path: `/ctx-sermons/v2/sermon/${id}`,
			method: "GET",
			parse: false,
		}).then((response) => {
			response.json().then((data) => {
				setSermon(data);
				setLoading(false);
			});
		});
	}, [id]);

	const browserLocale = navigator.language || navigator.userLanguage;

	const size = fileSize(sermon?.audio?.filesize);
	const fileSizeString = new Intl.NumberFormat(browserLocale, {
		style: "unit",
		unit: size.unit,
		unitDisplay: "short",
	}).format(size.value);

	console.log("size", fileSizeString);

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
						{sermon?.image?.large && <img src={sermon.image.large} />}
						<span onClick={() => setSermon(null)} className="close">
							&times;
						</span>
						<h3>{sermon.title}</h3>
						<AudioPlayer audio={sermon.audio.url} />
						<div className="description">{sermon.description}</div>
						<div className="download">
							<a href={sermon.audio.url} download>
								Download
							</a>
							<span>{fileSizeString}</span>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Modal;
