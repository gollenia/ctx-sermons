import { __ } from "@wordpress/i18n";

const Pagination = ({
	postsPerPage,
	totalPosts,
	onPaginate,
	currentPage,
	maxPages,
}) => {
	const pageArray = [];

	for (let i = 1; i <= maxPages; i++) {
		pageArray.push(i);
	}

	console.log(pageArray);

	console.log(pageArray, maxPages);

	if (!pageArray.length) {
		return null;
	}
	return (
		<nav>
			<ul className="pagination">
				<li className="page-item">
					<button
						href="!#"
						className="page-link"
						onClick={() => onPaginate(currentPage - 1)}
						disabled={currentPage === 1}
					>
						{__("Previous", "ctx-sermons")}
					</button>
				</li>
				{pageArray.map((number) => (
					<li key={number} className="page-item">
						<button
							onClick={() => onPaginate(number)}
							href="!#"
							className="page-link"
							disabled={currentPage === number}
						>
							{number}
						</button>
					</li>
				))}
				<li className="page-item">
					<button
						href="!#"
						className="page-link"
						onClick={() => onPaginate(currentPage + 1)}
						disabled={currentPage === maxPages}
					>
						{__("Next", "ctx-sermons")}
					</button>
				</li>
			</ul>
			<ul>
				<li>
					{__("Page", "ctx-sermons")} {currentPage} {__("of", "ctx-sermons")}{" "}
					{maxPages}
				</li>
			</ul>
		</nav>
	);
};

export default Pagination;
