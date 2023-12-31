import { useBlockProps } from "@wordpress/block-editor";
import { Placeholder } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import "./editor.scss";
import icon from "./icon";
import Inspector from "./inspector";

export default function Edit(props) {
	const EmptyPlaceholder = () => (
		<Placeholder icon={icon} label={__("Sermon List", "ctx-sermons")}>
			<table className="wp-block-ctx-sermons-sermon-list">
				<thead>
					<tr>
						<th>{__("Date", "ctx-sermons")}</th>
						<th>{__("Title", "ctx-sermons")}</th>
						<th>{__("Speaker", "ctx-sermons")}</th>
						<th>{__("Series", "ctx-sermons")}</th>
						<th>{__("Audio", "ctx-sermons")}</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>{__("No sermons found", "ctx-sermons")}</td>
					</tr>
				</tbody>
			</table>
		</Placeholder>
	);

	return (
		<div {...useBlockProps()}>
			<Inspector {...props} />
			<EmptyPlaceholder />
		</div>
	);
}
