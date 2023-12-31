import { useBlockProps } from "@wordpress/block-editor";
import {
	Card,
	CardBody,
	CardDivider,
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
					const image = select("core").getMedia(latestSermon?.featured_media);

					const audio = select("core").getEntityRecord(
						"postType",
						"attachment",
						latestSermon?.meta?._sermon_audio,
					);

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
										src={image.media_details?.sizes?.large?.source_url}
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
								{audio && showAudio && <audio controls src={audio.link} />}
							</CardBody>
							<CardDivider />
						</Card>
					);
				})}
		</div>
	);
}
