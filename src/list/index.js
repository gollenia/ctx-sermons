import apiFetch from "@wordpress/api-fetch";
import { useEffect, useRef, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { addQueryArgs } from "@wordpress/url";
import Modal from "./Components/Modal";
import Pagination from "./Components/Pagination";
import { ReactComponent as Play } from "./play.svg";
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
			showBiblePassage,
			limit,
			perRow,
			sermonSerie,
			sermonSpeaker,
		},
	} = props;

	const filter = [
		showAudio ? "audio" : null,
		showDate ? "date" : null,
		showDescription ? "description" : null,
		showImage ? "image" : null,
		showSpeaker ? "speaker" : null,
		showTitle ? "title" : null,
		showSeries ? "series" : null,
		showBiblePassage ? "bibleverse" : null,
	].filter((item) => item !== null);

	const [sermons, setSermons] = useState([]);
	const [currentSermon, setCurrentSermon] = useState(null);
	const [loading, setLoading] = useState(true);
	const [maxPages, setMaxPages] = useState(1);
	const [maxSermons, setMaxSermons] = useState(0);
	const [currentSerie, setCurrentSerie] = useState();
	const [currentSpeaker, setCurrentSpeaker] = useState();

	const [query, setQuery] = useState({
		page: 1,
		sermon_series: sermonSerie ? sermonSerie : "",
		sermon_speaker: sermonSpeaker ? sermonSpeaker : "",
		per_page: 10,
		filter: filter,
	});

	const searchRef = useRef(null);

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
	}, [query]);

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

	return (
		<div className="ctx-sermons-sermon-list">
			<div>
				<form onSubmit={(event) => searchSubmit(event)}>
					<input ref={searchRef} type="search" />
					<button type="submit">Search</button>
				</form>
			</div>
			{query.sermon_series && !sermonSerie && (
				<div>
					{query.sermon_series}
					<a
						href="#0"
						onClick={() => setQuery({ ...query, sermon_series: undefined })}
					>
						{__("Clear", "ctx-sermons")}
					</a>
				</div>
			)}
			{query.sermon_speaker && !sermonSpeaker && (
				<div>
					{query.sermon_speaker}
					<a
						href="#0"
						onClick={() => setQuery({ ...query, sermon_speaker: undefined })}
					>
						{__("Clear", "ctx-sermons")}
					</a>
				</div>
			)}
			<table>
				<thead>
					<tr>
						{showImage && <th>Image</th>}
						{showDate && <th>Date</th>}
						{showTitle && <th>Title</th>}
						{showSpeaker && <th>Speaker</th>}
						{showSeries && <th>Series</th>}
						{showBiblePassage && <th>Bible Passage</th>}
						{showAudio && <th></th>}
					</tr>
				</thead>
				<tbody>
					{sermons.map((sermon) => (
						<tr key={sermon.id}>
							{showImage && (
								<td>
									{sermon.image ? (
										<img src={sermon.image} alt={sermon.title} />
									) : (
										<td></td>
									)}
								</td>
							)}
							{showDate && <td>{intlDate(sermon.date)}</td>}
							{showTitle && <td>{sermon.title}</td>}
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
							{showAudio && (
								<td>
									{sermon.audio ? (
										<button
											className="play-button"
											onClick={() => setCurrentSermon(sermon)}
										>
											<Play />
										</button>
									) : (
										<td></td>
									)}
								</td>
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

			<Modal id={currentSermon ? currentSermon.id : null} />
		</div>
	);
};

export default List;
