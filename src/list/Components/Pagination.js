const Pagination = ({
	postsPerPage,
	totalPosts,
	onPaginate,
	currentPage,
	maxPages,
}) => {
	return (
		<nav>
			<ul className="pagination">
				<li className="page-item">
					<a
						href="!#"
						className="page-link"
						onClick={() => onPaginate(currentPage - 1)}
					>
						Previous
					</a>
				</li>
				{[...Array(maxPages)].map((number) => (
					<li key={number} className="page-item">
						<a
							onClick={() => onPaginate(number)}
							href="!#"
							className="page-link"
						>
							{number}
						</a>
					</li>
				))}
				<li className="page-item">
					<a
						href="!#"
						className="page-link"
						onClick={() => onPaginate(currentPage + 1)}
					>
						Next
					</a>
				</li>
			</ul>
		</nav>
	);
};

export default Pagination;
