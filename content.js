function addTotalsToTable() {

	const table = document.querySelector("table");
	if (!table) {
		console.error("No table found.");
		return;
	}

	const rows = table.querySelectorAll("tr");
	if (rows.length === 0) {
		console.error("No rows found in the table.");
		return;
	}

	const totals = [];

	function recalculateTotals() {
		totals.length = 0;

		for (let i = 1; i < rows.length; i++) { // Skip header row
			const cells = rows[i].querySelectorAll("td");

			cells.forEach((cell, index) => {
				if (index >= 3) {
					const value = parseFloat(cell.textContent.trim()) || 0;
					totals[index] = (totals[index] || 0) + value;
				}
			});
		}

		console.log("Totals array:", totals);

		const existingTotalRow = table.querySelector(".total-row");
		if (existingTotalRow) {
			existingTotalRow.remove();
		}

		const totalRow = document.createElement("tr");
		totalRow.classList.add("total-row");

		for (let i = 0; i < 3; i++) {
			const blankCell = document.createElement("td");
			blankCell.innerText = '';  // Blank for first 3 columns
			totalRow.appendChild(blankCell);
		}

		totals.forEach((total, index) => {
			if (index >= 3 && index < 7) {
				const totalCell = document.createElement("td");
				totalCell.innerText = total.toFixed(2);
				totalRow.appendChild(totalCell);
			}
		});

		table.appendChild(totalRow);
	}

	for (let i = 1; i < rows.length; i++) {
		const cells = rows[i].querySelectorAll("td");

		cells.forEach((cell, index) => {
			if (index >= 3) {
				cell.contentEditable = true;

				cell.addEventListener("input", () => {
					setTimeout(recalculateTotals, 0);
				});
				cell.addEventListener("keydown", (event) => {
					if (event.key === "Tab") {
						setTimeout(recalculateTotals, 0);
					}
				});
			}
		});
	}

	recalculateTotals();
}

//wait for table and row to be loaded
const observer = new MutationObserver((mutationsList, observer) => {

	const table = document.querySelector('[data-testid="table"]');
	const firstRow = document.querySelector(".css-bsbkdd");

	if (table && firstRow) {
		addTotalsToTable();
		observer.disconnect();
	}
});

observer.observe(document.body, { childList: true, subtree: true });

