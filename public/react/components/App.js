import React, { useEffect, useState } from "react";
import CreateItemForm from "./CreateItemForm";
import Inventory from "./Inventory";
import UpdateItemForm from "./UpdateItemForm";

// import and prepend the api url to any fetch calls
import apiURL from "../api";

export const App = () => {
	const [items, setItems] = useState([]);
	const [currentItem, setCurrentItem] = useState(null);

	const [isCreateFormShowing, setIsCreateFormShowing] = useState(false);
	const [isUpdateFormShowing, setIsUpdateFormShowing] = useState(false);

	async function addItem(data) {
		// Send the POST request to the back end
		const response = await fetch(`${apiURL}/items`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		// If the POST request was successful...
		if (response.ok) {
			// Add the new item to state
			const newItem = await response.json();
			setItems([...items, newItem]);

			// Hide the form
			setIsCreateFormShowing(false);
		}
	}

	async function updateItem(id, data) {
		// Send the PATCH request to the back end
		const response = await fetch(`${apiURL}/items/${id}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		// If the PATCH request was successful...
		if (response.ok) {
			const updatedItem = await response.json();

			const index = items.findIndex(item => {
				if (item.id === id) {
					return true;
				} else {
					return false;
				}
			});

			// Replace the old item with the updated item
			const updatedItems = items.toSpliced(index, 1, updatedItem);
			setItems(updatedItems);
			setCurrentItem(updatedItem);

			// Hide the form
			setIsUpdateFormShowing(false);
		}
	}

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
				<button onClick={() => setIsCreateFormShowing(!isCreateFormShowing)}>
					{isCreateFormShowing ? "Hide Form" : "Show Form"}
				</button>
				{isCreateFormShowing && <CreateItemForm addItem={addItem} />}
				<Inventory items={items} setCurrentItem={setCurrentItem} />
			</main>
		);
	}

	// Otherwise, show the single item view
	return (
		<main>
			<button onClick={() => setIsUpdateFormShowing(!isUpdateFormShowing)}>
				{isUpdateFormShowing ? "Hide Form" : "Show Form"}
			</button>
			{isUpdateFormShowing && <UpdateItemForm {...currentItem} updateItem={updateItem} />}
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
