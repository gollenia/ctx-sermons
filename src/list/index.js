import apiFetch from "@wordpress/api-fetch";
import { useEffect, useRef, useState } from "@wordpress/element";
import { addQueryArgs } from "@wordpress/url";
import Pagination from "./Components/Pagination";
import { ReactComponent as Play } from "./play.svg";
import "./style.scss";
const List = (props) => {
	const [sermons, setSermons] = useState([]);
	const [sermon, setSermon] = useState(null);
	const [loading, setLoading] = useState(true);
	const [maxPages, setMaxPages] = useState(1);
	const [maxSermons, setMaxSermons] = useState(0);
	const [query, setQuery] = useState({
		page: 1,
		sermon_series: "",
		sermon_speaker: "",
		per_page: 10,
	});

	const searchRef = useRef(null);

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
		},
	} = props;

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

	const backdropClickHandler = (event) => {
		event.preventDefault();
		setSermon(null);
	};

	const filterSermons = (query) => {
		return sermons.filter((sermon) => {
			if (sermonSerie) {
				return sermon.series[0] === sermonSerie;
			}
			return true;
		});
	};

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
		setQuery({ ...query, search: searchRef.current.value });
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
												return preacher.name;
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
												return serie.name;
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
											onClick={() => setSermon(sermon)}
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
			<div
				className={`ctx-sermon-player-modal ${sermon ? "is-open" : ""}`}
				onClick={(event) => {
					backdropClickHandler(event);
				}}
			>
				<div className="window">
					{sermon && sermon.audio && (
						<div className="content">
							<span onClick={() => setSermon(null)} className="close">
								&times;
							</span>
							<h3>{sermon.title}</h3>
							<audio controls src={sermon.audio}>
								Listen
							</audio>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default List;
