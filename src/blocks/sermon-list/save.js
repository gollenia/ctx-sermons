import { useBlockProps } from "@wordpress/block-editor";

export default function save(props) {
	console.log(props);
	return (
		<div {...useBlockProps.save()}>
			<div
				id="sermon-list"
				data-attributes={JSON.stringify(props.attributes)}
				className="wp-block-ctx-sermons-sermon-list"
			></div>
		</div>
	);
}
