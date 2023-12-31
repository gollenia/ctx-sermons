import { createRoot } from "@wordpress/element";
import List from "./list/index";
document.addEventListener("DOMContentLoaded", function () {
	const rootElement = document.getElementById("sermon-list");
	const attributes = JSON.parse(rootElement.dataset.attributes);
	if (!rootElement) return;
	createRoot(rootElement).render(<List attributes={attributes} />);
});
