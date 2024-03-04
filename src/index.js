import * as latestSermon from "./blocks/sermon-cards";
import * as sermonList from "./blocks/sermon-list";
import SermonDetails from "./plugins/details/details";

const { registerBlockType } = wp.blocks;

const registerBlock = (block) => {
	if (!block) return;
	const { name, settings } = block;
	registerBlockType(name, settings);
};

export const registerBlocks = () => {
	[latestSermon, sermonList].forEach(registerBlock);
};

registerBlocks();
const { registerPlugin } = wp.plugins;
registerPlugin("plugin-sermon-details", {
	icon: null,
	render: SermonDetails,
});
