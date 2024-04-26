import { createRoot } from "@wordpress/element";
import Cards from "./cards/Cards";
document.addEventListener("DOMContentLoaded", function () {
	const rootElement = document.getElementById("ctx-sermon-cards");
	const attributes = JSON.parse(rootElement.dataset.attributes);
	if (!rootElement) return;
	createRoot(rootElement).render(<Cards attributes={attributes} />);
});
