/**
 * Adds a metabox for the page color settings
 */

/**
 * WordPress dependencies
 */
import { Button, TextControl } from "@wordpress/components";
import { select } from "@wordpress/data";
import { PluginDocumentSettingPanel } from "@wordpress/editor";

import { MediaUpload, MediaUploadCheck } from "@wordpress/block-editor";
import { useEntityProp } from "@wordpress/core-data";
import { useSelect } from "@wordpress/data";
import { useState } from "@wordpress/element";

import { __ } from "@wordpress/i18n";

const SermonMeta = () => {
	const postType = select("core/editor").getCurrentPostType();
	const [openDatePopup, setOpenDatePopup] = useState(false);

	if (postType !== "sermon") return <></>;

	const [meta, setMeta] = useEntityProp("postType", postType, "meta");

	const file = useSelect(
		(select) =>
			select("core").getEntityRecord(
				"postType",
				"attachment",
				meta?._sermon_audio,
			),
		[meta?._sermon_audio],
	);

	console.log(file);

	return (
		<PluginDocumentSettingPanel
			name="sermon-verse-settings"
			title={__("Sermon Details", "ctx-sermons")}
			className="events-location-settings"
		>
			<MediaUploadCheck>
				<MediaUpload
					onSelect={(value) => {
						setMeta({ _sermon_audio: value.id });
					}}
					allowedTypes={["audio", "video"]}
					value={meta?._sermon_audio}
					render={({ open }) => (
						<div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
							{meta?._sermon_audio ? (
								<>
									<p>{file?.title?.rendered}</p>
									<Button onClick={open} size="small" variant="secondary">
										{__("Change Audio", "ctx-sermons")}
									</Button>
								</>
							) : (
								<div>
									<p>{__("No audio file selected", "ctx-sermons")}</p>
									<Button onClick={open} size="small" variant="primary">
										{__("Upload Audio", "ctx-sermons")}
									</Button>
								</div>
							)}
						</div>
					)}
				/>
			</MediaUploadCheck>
			<TextControl
				type="text"
				label={__("Bible verse", "ctx-sermons")}
				value={meta?._sermon_bibleverse}
				onChange={(value) => {
					setMeta({ _sermon_bibleverse: value });
				}}
			/>
			<TextControl
				type="date"
				label={__("Date", "ctx-sermons")}
				value={meta?._sermon_date}
				onChange={(value) => {
					setMeta({ _sermon_date: value });
				}}
			/>
			<TextControl
				type="url"
				label={__("Link to Sermon", "ctx-sermons")}
				value={meta?._sermon_link}
				onChange={(value) => {
					setMeta({ _sermon_link: value });
				}}
			/>
		</PluginDocumentSettingPanel>
	);
};

export default SermonMeta;
