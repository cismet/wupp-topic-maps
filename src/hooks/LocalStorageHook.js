import React, { useState } from 'react';

// Usage
function App() {
	// Similar to useState but first arg is key to the value in local storage.
	const [ name, setName ] = useLocalStorage('name', 'Bob');

	return (
		<div>
			<input
				type='text'
				placeholder='Enter your name'
				value={name}
				onChange={(e) => setName(e.target.value)}
			/>
		</div>
	);
}

// Hook
export function useLocalStorage(key, initialValue, objectType = false) {
	// State to store our value
	// Pass initial state function to useState so logic is only executed once
	const [ storedValue, setStoredValue ] = useState(() => {
		try {
			// Get from local storage by key
			const item = window.localStorage.getItem(key);
			return item;
			// Parse stored json or if none return initialValue
			if (objectType === true) {
				return item ? JSON.parse(item) : initialValue;
			} else {
				//simple value (bool, int, float, string)
				return item || initialValue;
			}
		} catch (error) {
			// If error also return initialValue
			console.log(error);
			return initialValue;
		}
	});

	// Return a wrapped version of useState's setter function that ...
	// ... persists the new value to localStorage.
	const setValue = (value) => {
		try {
			// Allow value to be a function so we have same API as useState
			const valueToStore = value instanceof Function ? value(storedValue) : value;
			// Save state
			setStoredValue(valueToStore);
			// Save to local storage
			if (objectType) {
				window.localStorage.setItem(key, JSON.stringify(valueToStore));
			} else {
				window.localStorage.setItem(key, valueToStore);
			}
		} catch (error) {
			// A more advanced implementation would handle the error case
			console.log(error);
		}
	};

	return [ storedValue, setValue ];
}
