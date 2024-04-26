import React from "react";

import apiFetch from "@wordpress/api-fetch";
import { useEffect, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { addQueryArgs } from "@wordpress/url";
import Modal from "../common/Modal";
import "../common/player.scss";
import "./style.scss";
const Cards = (props) => {
	const {
		attributes: {
			showDate,
			showSpeaker,
			showTitle,
			showAudio,
			showSeries,
			showDescription,
			showImage,
			showLink,
			showBiblePassage,
			limit,
			perRow,
			sermonSerie,
			sermonSpeaker,
			mediaId,
		},
	} = props;

	const [sermons, setSermons] = useState([]);
	const [currentSermon, setCurrentSermon] = useState(null);
	const [loading, setLoading] = useState(true);
	const [maxPages, setMaxPages] = useState(1);
	const [maxSermons, setMaxSermons] = useState(0);
	const [currentSerie, setCurrentSerie] = useState();
	const [currentSpeaker, setCurrentSpeaker] = useState();
	const [mediaThumbnail, setMediaThumbnail] = useState("");

	const [query, setQuery] = useState({
		sermon_series: sermonSerie ? sermonSerie : "",
		per_page: limit,
		embed: true,
	});

	useEffect(() => {
		apiFetch({
			path: addQueryArgs("/ctx-sermons/v2/list", query),
			method: "GET",
			parse: false,
		}).then((response) => {
			setMaxPages(response.headers.get("X-WP-TotalPages"));
			setMaxSermons(response.headers.get("X-WP-Total"));
			response.json().then((data) => {
				setSermons(data);
				setLoading(false);
			});
		});

		apiFetch({
			path: `/wp/v2/media/${mediaId}`,
			method: "GET",
			parse: false,
		}).then((response) => {
			response.json().then((data) => {
				console.log(data);
				setMediaThumbnail(data.media_details.sizes);
			});
		});
	}, []);

	return (
		<div className="ctx-sermons">
			{loading ? (
				<p>{__("Loading...", "ctx-sermons")}</p>
			) : (
				<div className="ctx-sermons-cards">
					{sermons.map((sermon) => {
						console.log(mediaThumbnail?.large);
						return (
							<div key={sermon.id} className="ctx-sermons-card">
								{showImage && (
									<>
										{(sermon.image.large || mediaThumbnail?.large) && (
											<div className="ctx-sermons-card-image">
												<img
													src={
														sermon.image.large ||
														mediaThumbnail?.large?.source_url
													}
												/>
											</div>
										)}
									</>
								)}
								<div className="ctx-sermons-card-content">
									{showDate && (
										<p className="ctx-sermons-card-date">
											{new Date(sermon.date).toLocaleDateString()}
										</p>
									)}
									{showTitle && (
										<h2 className="ctx-sermons-card-title">{sermon.title}</h2>
									)}
									{showSpeaker && sermon.speaker?.length > 0 && (
										<p className="ctx-sermons-card-speaker">
											{sermon.speaker[0].name}
										</p>
									)}
									{showSeries && sermon.series?.length > 0 && (
										<p className="ctx-sermons-card-series">
											{__("Series", "ctx-sermons")}: {sermon.series[0]?.name}
										</p>
									)}
								</div>
								<div className="ctx-sermons-card-footer">
									{showAudio && sermon.audio && (
										<div className="ctx-sermons-card-audio">
											<button
												className="button button--primary"
												onClick={() => setCurrentSermon(sermon)}
											>
												<span>{__("Listen", "ctx-sermons")}</span>
											</button>
										</div>
									)}
									{showLink && sermon.link && (
										<div className="ctx-sermons-card-link">
											<a href={sermon.link} target="_blank">
												{__("Open", "ctx-sermons")}
											</a>
										</div>
									)}
								</div>
							</div>
						);
					})}
				</div>
			)}

			<Modal
				sermon={currentSermon}
				setSermon={setCurrentSermon}
				altImage={mediaThumbnail}
			/>
		</div>
	);
};

export default Cards;
