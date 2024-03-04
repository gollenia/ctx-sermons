import { InspectorControls } from "@wordpress/block-editor";

import { MediaUpload, MediaUploadCheck } from "@wordpress/block-editor";
import { Button, CheckboxControl, PanelBody } from "@wordpress/components";

import { useSelect } from "@wordpress/data";

import { __ } from "@wordpress/i18n";

export default function Inspector({ attributes, setAttributes }) {
	const {
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
		mediaId,
		mediaUrl,
		sermonSerie,
	} = attributes;

	const setLimit = (limit) => {
		setAttributes({ limit });
		if (limit < perRow) {
			setAttributes({ perRow: limit });
		}
	};

	const availableSermonSeries = useSelect((select) => {
		const { getEntityRecords } = select("core");

		const result = getEntityRecords("taxonomy", "sermon_series");
		if (!result) {
			return [];
		}
		return result?.map((serie) => ({
			label: serie.name,
			value: serie.id,
		}));
	}, []);

	console.log(availableSermonSeries);

	const setCategory = (value) => {
		if (!value) {
			setAttributes({ sermonSerie: "" });
			return;
		}
		setAttributes({ sermonSerie: value });
	};

	const ALLOWED_MEDIA_TYPES = ["image"];

	return (
		<InspectorControls>
			<PanelBody title={__("Display", "ctx-sermons")}>
				<p>
					{__(
						"Select an image to display when the sermon has no own",
						"ctx-sermons",
					)}
				</p>
				<MediaUploadCheck>
					<MediaUpload
						onSelect={(media) => {
							setAttributes({
								mediaId: media.id,
								mediaUrl: media.sizes.medium.url,
							});
						}}
						allowedTypes={ALLOWED_MEDIA_TYPES}
						value={mediaId}
						render={({ open }) => (
							<div>
								{mediaUrl && <img src={mediaUrl} onClick={open} />}
								<Button variant="secondary" size="small" onClick={open}>
									{mediaId
										? __("Replace Image", "ctx-sermons")
										: __("Select Image", "ctx-sermons")}
								</Button>
							</div>
						)}
					/>
				</MediaUploadCheck>
			</PanelBody>
			<PanelBody title={__("Content", "ctx-sermons")}>
				<CheckboxControl
					label={__("Show Date", "ctx-sermons")}
					checked={showDate}
					onChange={(showDate) => setAttributes({ showDate })}
				/>
				<CheckboxControl
					label={__("Show Speaker", "ctx-sermons")}
					checked={showSpeaker}
					onChange={(showSpeaker) => setAttributes({ showSpeaker })}
				/>
				<CheckboxControl
					label={__("Show Title", "ctx-sermons")}
					checked={showTitle}
					onChange={(showTitle) => setAttributes({ showTitle })}
				/>
				<CheckboxControl
					label={__("Show Audio", "ctx-sermons")}
					checked={showAudio}
					onChange={(showAudio) => setAttributes({ showAudio })}
				/>
				<CheckboxControl
					label={__("Show Series", "ctx-sermons")}
					checked={showSeries}
					onChange={(showSeries) => setAttributes({ showSeries })}
				/>
				<CheckboxControl
					label={__("Show Description", "ctx-sermons")}
					checked={showDescription}
					onChange={(showDescription) => setAttributes({ showDescription })}
				/>
				<CheckboxControl
					label={__("Show Image", "ctx-sermons")}
					checked={showImage}
					onChange={(showImage) => setAttributes({ showImage })}
				/>
				<CheckboxControl
					label={__("Show Bible Passage", "ctx-sermons")}
					checked={showBiblePassage}
					onChange={(showBiblePassage) => setAttributes({ showBiblePassage })}
				/>
				<CheckboxControl
					label={__("Show Link", "ctx-sermons")}
					checked={showLink}
					onChange={(showLink) => setAttributes({ showLink })}
				/>
			</PanelBody>
		</InspectorControls>
	);
}
