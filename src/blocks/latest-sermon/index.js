/**
 * Internal dependencies
 */
import metadata from "./block.json";
import edit from "./edit";
import "./editor.scss";
import icon from "./icon";
import "./style.scss";

/**
 * Wordpress dependencies
 */

const { name } = metadata;

const settings = {
	icon,
	edit,
	save: () => {
		return null;
	},
};

export { name, settings };
