import { InspectorControls } from "@wordpress/block-editor";

import { CheckboxControl, PanelBody } from "@wordpress/components";

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
		limit,
		perRow,
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

	return (
		<InspectorControls>
			<PanelBody title={__("Content", "ctx-blocks")}>
				<CheckboxControl
					label={__("Show Date", "ctx-blocks")}
					checked={showDate}
					onChange={(showDate) => setAttributes({ showDate })}
				/>
				<CheckboxControl
					label={__("Show Speaker", "ctx-blocks")}
					checked={showSpeaker}
					onChange={(showSpeaker) => setAttributes({ showSpeaker })}
				/>
				<CheckboxControl
					label={__("Show Title", "ctx-blocks")}
					checked={showTitle}
					onChange={(showTitle) => setAttributes({ showTitle })}
				/>
				<CheckboxControl
					label={__("Show Audio", "ctx-blocks")}
					checked={showAudio}
					onChange={(showAudio) => setAttributes({ showAudio })}
				/>
				<CheckboxControl
					label={__("Show Series", "ctx-blocks")}
					checked={showSeries}
					onChange={(showSeries) => setAttributes({ showSeries })}
				/>
				<CheckboxControl
					label={__("Show Description", "ctx-blocks")}
					checked={showDescription}
					onChange={(showDescription) => setAttributes({ showDescription })}
				/>
				<CheckboxControl
					label={__("Show Image", "ctx-blocks")}
					checked={showImage}
					onChange={(showImage) => setAttributes({ showImage })}
				/>
				<CheckboxControl
					label={__("Show Bible Passage", "ctx-blocks")}
					checked={showBiblePassage}
					onChange={(showBiblePassage) => setAttributes({ showBiblePassage })}
				/>
			</PanelBody>
		</InspectorControls>
	);
}
