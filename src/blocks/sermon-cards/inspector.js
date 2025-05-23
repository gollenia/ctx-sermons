import {
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
} from "@wordpress/block-editor";
import {
	Button,
	CheckboxControl,
	ComboboxControl,
	PanelBody,
	RangeControl,
} from "@wordpress/components";

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
		showBiblePassage,
		showLink,
		limit,
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
			<PanelBody title={__("Appearance", "ctx-sermons")}>
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
			<PanelBody title={__("Sermon Limit", "ctx-sermons")}>
				<RangeControl
					label={__("Limit", "ctx-sermons")}
					value={limit}
					onChange={(limit) => setLimit(limit)}
					min={1}
					max={20}
				/>
				<RangeControl
					label={__("Columns", "ctx-sermons")}
					value={attributes.perRow}
					onChange={(perRow) => setAttributes({ perRow })}
					min={1}
					max={limit}
					step={1}
				/>

				<ComboboxControl
					label={__("Sermon Series", "ctx-sermons")}
					value={sermonSerie}
					onChange={(value) => setCategory(value)}
					options={availableSermonSeries}
				/>
			</PanelBody>
			<PanelBody title={__("Sermon Details", "ctx-sermons")}>
				<CheckboxControl
					label={__("Show Date", "ctx-sermons")}
					checked={showDate}
					onChange={() => setAttributes({ showDate: !showDate })}
				/>

				<CheckboxControl
					label={__("Show Image", "ctx-sermons")}
					checked={showImage}
					onChange={() => setAttributes({ showImage: !showImage })}
				/>
				<CheckboxControl
					label={__("Show Speaker", "ctx-sermons")}
					checked={showSpeaker}
					onChange={() => setAttributes({ showSpeaker: !showSpeaker })}
				/>

				<CheckboxControl
					label={__("Show Title", "ctx-sermons")}
					checked={showTitle}
					onChange={() => setAttributes({ showTitle: !showTitle })}
				/>

				<CheckboxControl
					label={__("Show Bible Passage", "ctx-sermons")}
					checked={showBiblePassage}
					onChange={() =>
						setAttributes({ showBiblePassage: !showBiblePassage })
					}
				/>

				<CheckboxControl
					label={__("Show Audio", "ctx-sermons")}
					checked={showAudio}
					onChange={() => setAttributes({ showAudio: !showAudio })}
				/>

				<CheckboxControl
					label={__("Show Series", "ctx-sermons")}
					checked={showSeries}
					onChange={() => setAttributes({ showSeries: !showSeries })}
				/>

				<CheckboxControl
					label={__("Show Description", "ctx-sermons")}
					checked={showDescription}
					onChange={() => setAttributes({ showDescription: !showDescription })}
				/>
				<CheckboxControl
					label={__("Show Link", "ctx-sermons")}
					checked={showLink}
					onChange={() => setAttributes({ showLink: !showLink })}
				/>
			</PanelBody>
		</InspectorControls>
	);
}
