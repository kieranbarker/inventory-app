import React, { useEffect, useState } from "react";

// import and prepend the api url to any fetch calls
import apiURL from "../api";

export const App = () => {
	const [items, setItems] = useState([]);
	const [currentItem, setCurrentItem] = useState(null);

	async function deleteItem(id) {
		// Send the DELETE request to the back end
		const response = await fetch(`${apiURL}/items/${id}`, {
			method: "DELETE",
		});

		// If the DELETE request was successful...
		if (response.ok) {
			const filteredItems = items.filter(item => {
				if (item.id === id) {
					return false;
				} else {
					return true;
				}
			});

			// Remove the deleted item from state
			setItems(filteredItems);

			// Return to the home page
			setCurrentItem(null);
		}
	}

	function confirmDelete(id) {
		// Returns true if the user presses OK, otherwise false
		const confirmed = window.confirm("Are you sure you want to delete this item?");

		if (confirmed) {
			deleteItem(id);
		}
	}

	useEffect(() => {
		async function fetchItems() {
			try {
				const response = await fetch(`${apiURL}/items`);
				const itemsData = await response.json();
				setItems(itemsData);
			} catch (err) {
				console.log("Oh no an error!", err);
			}
		}

		fetchItems();
	}, []);

	// If there is no current item, show all items
	if (!currentItem) {
		return (
			<main>
				<h1>Inventory App</h1>
				<ul>
					{items.map(item => (
						<li key={item.id}>
							<h2>
								<button onClick={() => setCurrentItem(item)}>{item.name}</button>
							</h2>
							<img src={item.image} alt="" />
						</li>
					))}
				</ul>
			</main>
		);
	}

	// Otherwise, show the single item view
	return (
		<main>
			<h1>{currentItem.name}</h1>
			<p>£{currentItem.price.toFixed(2)}</p>
			<p>{currentItem.description}</p>
			<img src={currentItem.image} alt="" />
			<p>
				<button onClick={() => setCurrentItem(null)}>All Items</button>
			</p>
			<p>
				<button onClick={() => confirmDelete(currentItem.id)}>Delete Item</button>
			</p>
		</main>
	);
};
