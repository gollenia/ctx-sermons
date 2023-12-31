import SermonDetails from "./plugins/details/details";

import * as latestSermon from "./blocks/latest-sermon";
import * as sermonList from "./blocks/sermon-list";

const { registerPlugin } = wp.plugins;

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

registerPlugin("plugin-sermon-details", {
	icon: null,
	render: SermonDetails,
});
