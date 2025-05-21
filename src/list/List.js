import apiFetch from "@wordpress/api-fetch";
import { useEffect, useRef, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { addQueryArgs } from "@wordpress/url";
import Modal from "../common/Modal";
import Pagination from "./Components/Pagination";
import "./style.scss";
const List = (props) => {
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

	const filter = [].filter((item) => item !== null);

	const [sermons, setSermons] = useState([]);
	const [currentSermon, setCurrentSermon] = useState(null);
	const [loading, setLoading] = useState(true);
	const [maxPages, setMaxPages] = useState(1);
	const [maxSermons, setMaxSermons] = useState(0);
	const [currentSerie, setCurrentSerie] = useState();
	const [currentSpeaker, setCurrentSpeaker] = useState();
	const [mediaThumbnail, setMediaThumbnail] = useState("");

	const [query, setQuery] = useState({
		page: 1,
		sermon_series: sermonSerie ? sermonSerie : "",
		sermon_speaker: sermonSpeaker ? sermonSpeaker : "",
		per_page: 10,
	});

	const searchRef = useRef(null);

	useEffect(() => {
		apiFetch({
			path: addQueryArgs("/ctx-sermons/v2/sermons", query),
			method: "GET",
			parse: false,
		}).then((response) => {
			setMaxPages(parseInt(response.headers.get("X-WP-TotalPages")));
			setMaxSermons(parseInt(response.headers.get("X-WP-Total")));
			response.json().then((data) => {
				setSermons(data);
				setLoading(false);
			});
		});
	}, [query]);

	useEffect(() => {
		apiFetch({
			path: `/wp/v2/media/${mediaId}`,
			method: "GET",
			parse: false,
		}).then((response) => {
			response.json().then((data) => {
				setMediaThumbnail(data.media_details.sizes);
			});
		});
	}, []);

	const altImage = mediaThumbnail?.thumbnail?.source_url;

	const intlDate = (date) => {
		const options = {
			year: "numeric",
			month: "long",
			day: "numeric",
		};
		return new Date(date).toLocaleDateString(undefined, options);
	};

	const searchSubmit = (event) => {
		event.preventDefault();
		event.stopPropagation();
		setQuery({
			...query,
			search: searchRef.current.value,
			sermon_series: undefined,
			sermon_speaker: undefined,
		});
		return true;
	};

	const openSermon = (sermon) => {
		if (sermon.audio) setCurrentSermon(sermon);
		if (sermon.link) window.open(sermon.link, "_blank");
	};

	return (
		<div className="ctx-sermons-sermon-list">
			<div className="ctx-sermons-sermon-list-search">
				<form onSubmit={(event) => searchSubmit(event)}>
					<div className="input">
						<input
							ref={searchRef}
							type="search"
							placeholder={__("Search term", "ctx-sermons")}
						/>
					</div>
					<button className="button button--primary" type="submit">
						{__("Search", "ctx-sermons")}
					</button>
					<div className="spacer"></div>
					{(query.sermon_series || query.sermon_speaker) && (
						<div className="reset">
							<a
								href="#0"
								className="button button--secondary"
								onClick={() =>
									setQuery({
										...query,
										sermon_series: undefined,
										sermon_speaker: undefined,
									})
								}
							>
								{__("Reset", "ctx-sermons")}
							</a>
						</div>
					)}
				</form>
			</div>

			<table>
				<thead>
					<tr>
						{showImage && <th className="ctx-sermons-sermon-list-image"></th>}
						{showDate && <th>{__("Date", "ctx-sermons")}</th>}
						{showTitle && <th>{__("Title", "ctx-sermons")}</th>}
						{showSpeaker && <th>{__("Preacher", "ctx-sermons")}</th>}
						{showSeries && <th>{__("Series", "ctx-sermons")}</th>}
						{showBiblePassage && <th>{__("Bible verse", "ctx-sermons")}</th>}
					</tr>
				</thead>
				<tbody>
					{sermons.map((sermon) => (
						<tr key={sermon.id}>
							{showImage && (
								<td
									onClick={() => {
										openSermon(sermon);
									}}
									className="ctx-sermons-sermon-list-image"
								>
									{sermon.image.thumbnail || altImage ? (
										<img
											src={sermon.image?.thumbnail || altImage}
											alt={sermon.title}
										/>
									) : (
										<></>
									)}
								</td>
							)}
							{showDate && (
								<td
									className="date"
									onClick={() => {
										openSermon(sermon);
									}}
								>
									{intlDate(sermon.date)}
								</td>
							)}
							{showTitle && (
								<td
									className="title"
									onClick={() => {
										openSermon(sermon);
									}}
								>
									{sermon.title}
								</td>
							)}
							{showSpeaker && (
								<>
									{sermon["speaker"] ? (
										<td>
											{sermon.speaker.map((preacher) => {
												return (
													<a
														href="#0"
														onClick={() => {
															setQuery({
																...query,
																sermon_speaker: preacher.id,
																sermon_series: undefined,
																search: "",
																page: 1,
															});
														}}
													>
														{preacher.name}
													</a>
												);
											})}
										</td>
									) : (
										<td></td>
									)}
								</>
							)}
							{showSeries && (
								<>
									{sermon["series"] ? (
										<td>
											{sermon.series.map((serie) => {
												return (
													<a
														href="#0"
														onClick={() => {
															setQuery({
																...query,
																sermon_series: serie.id,
																sermon_speaker: undefined,
																search: "",
																page: 1,
															});
														}}
													>
														{serie.name}
													</a>
												);
											})}
										</td>
									) : (
										<td></td>
									)}
								</>
							)}
							{showBiblePassage && (
								<td>{sermon.bibleverse ? sermon.bibleverse : <td></td>}</td>
							)}
						</tr>
					))}
				</tbody>
			</table>
			<Pagination
				onPaginate={(page) => setQuery({ ...query, page })}
				postsPerPage={limit}
				totalPosts={maxSermons}
				maxPages={maxPages}
				currentPage={query.page}
			/>

			<Modal
				sermon={currentSermon}
				setSermon={setCurrentSermon}
				altImage={mediaThumbnail}
			/>
		</div>
	);
};

export default List;
