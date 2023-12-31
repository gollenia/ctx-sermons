/**
 * Adds a metabox for the page color settings
 */

/**
 * WordPress dependencies
 */
import { TextControl } from "@wordpress/components";
import { select } from "@wordpress/data";
import { PluginDocumentSettingPanel } from "@wordpress/edit-post";

import { MediaUpload, MediaUploadCheck } from "@wordpress/block-editor";
import { Button } from "@wordpress/components";
import { useEntityProp } from "@wordpress/core-data";
import { useSelect } from "@wordpress/data";
import { useState } from "@wordpress/element";

import { __ } from "@wordpress/i18n";

const SermonMeta = () => {
	const postType = select("core/editor").getCurrentPostType();

	if (postType !== "sermon") return <></>;

	const [dateOpen, setDateOpen] = useState(false);
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
									<audio controls src={file?.link} />
									<Button onClick={open} isSmall={true} variant="secondary">
										{__("Change Audio", "ctx-sermons")}
									</Button>
								</>
							) : (
								<Button onClick={open} isSmall={true} variant="primary">
									{__("Upload Audio", "ctx-sermons")}
								</Button>
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
		</PluginDocumentSettingPanel>
	);
};

export default SermonMeta;
