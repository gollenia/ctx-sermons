import { useBlockProps } from "@wordpress/block-editor";
import {
	Card,
	CardBody,
	CardDivider,
	CardFooter,
	CardHeader,
	CardMedia,
} from "@wordpress/components";
import { select, useSelect } from "@wordpress/data";
import Inspector from "./inspector";

import "./editor.scss";

export default function Edit(props) {
	const { attributes, setAttributes } = props;
	const {
		showDate,
		showSpeaker,
		showTitle,
		showAudio,
		showBiblePassage,
		showSeries,
		showDescription,
		showImage,
		showLink,
		limit,
		sermonSerie,
	} = attributes;

	const latestSermons = useSelect((select) => {
		const { getEntityRecords } = select("core");
		const query = {
			per_page: limit,
			orderby: "date",
			order: "desc",
			status: "publish",
			sermon_series: !!sermonSerie ? [sermonSerie] : undefined,
			_embed: true,
		};
		const result = getEntityRecords("postType", "sermon", query);

		return result;
	});

	const style = {
		display: "grid",
		gridTemplateColumns: `repeat(${attributes.perRow}, 1fr)`,
		gap: "1rem",
	};

	return (
		<div {...useBlockProps({ style })}>
			<Inspector {...props} />

			{latestSermons &&
				latestSermons.map((latestSermon) => {
					const image = latestSermon._embedded["wp:featuredmedia"]?.[0];
					console.log(image);

					const serie = select("core").getEntityRecord(
						"taxonomy",
						"sermon_series",
						latestSermon.sermon_series[0],
					);

					const speaker = select("core").getEntityRecord(
						"taxonomy",
						"sermon_speaker",
						latestSermon.sermon_speaker[0],
					);

					return (
						<Card>
							{image && showImage && (
								<CardMedia>
									<img
										src={
											image.media_details?.sizes?.large?.source_url ||
											image.source_url
										}
										alt={latestSermon.title.rendered}
									/>
								</CardMedia>
							)}
							<CardHeader>
								{showTitle && <h2>{latestSermon.title.rendered}</h2>}
							</CardHeader>
							<CardBody>
								{showDate && <p>{latestSermon.date}</p>}
								{showSpeaker && <p>{speaker?.name}</p>}
								{showBiblePassage && (
									<p>{latestSermon.meta?._sermon_bibleverse}</p>
								)}
								{showSeries && <p>{serie?.name}</p>}
								{showDescription && (
									<p
										dangerouslySetInnerHTML={{
											__html: latestSermon.excerpt.rendered,
										}}
									></p>
								)}
							</CardBody>
							<CardFooter>
								{showAudio && latestSermon?.meta?._sermon_audio && (
									<button onClick={() => console.log(audio)}>
										<i className="fas fa-play"></i>PLAY
									</button>
								)}
								{showLink && latestSermon?.meta?._sermon_link && (
									<a href={latestSermon.link}>Open</a>
								)}
							</CardFooter>
							<CardDivider />
						</Card>
					);
				})}
		</div>
	);
}
