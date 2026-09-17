import { browser } from '$app/env';
import info from './info';

// Consistently format the bird structure (passthrough — data already formatted in birds.json)
export const returnFormattedBird = (bird) => bird;

export const returnFormattedBirds = (birds) => birds;

export const returnBirdFromParam = (param, paramType, formattedBirds) => {
	let birdToReturn;

	for (var i = 0; i < formattedBirds.length; i++) {
		if (formattedBirds[i][paramType] === param) {
			birdToReturn = formattedBirds[i];
			break;
		}
	}
	return birdToReturn;
};

export const returnBirdFromId = (id, formattedBirds) => {
	let birdToReturn;

	for (var i = 0; i < formattedBirds.length; i++) {
		if (formattedBirds[i].id === id) {
			birdToReturn = formattedBirds[i];
			break;
		}
	}
	return birdToReturn;
};

export const invertColor = (hex, bw) => {
	if (hex.indexOf('#') === 0) {
		hex = hex.slice(1);
	}
	// convert 3-digit hex to 6-digits.
	if (hex.length === 3) {
		hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
	}
	if (hex.length !== 6) {
		throw new Error('Invalid HEX color.');
	}
	var r = parseInt(hex.slice(0, 2), 16),
		g = parseInt(hex.slice(2, 4), 16),
		b = parseInt(hex.slice(4, 6), 16);
	if (bw) {
		// http://stackoverflow.com/a/3943023/112731
		return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? '#000000' : '#FFFFFF';
	}
	// invert color components
	r = (255 - r).toString(16);
	g = (255 - g).toString(16);
	b = (255 - b).toString(16);
	// pad each with zeros and return
	return '#' + padZero(r) + padZero(g) + padZero(b);
};

function padZero(str, len) {
	len = len || 2;
	var zeros = new Array(len).join('0');
	return (zeros + str).slice(-len);
}

export function formatPhoneNumber(phoneNumberString) {
	var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
	var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
	if (match) {
		var intlCode = match[1] ? '+1 ' : '';
		return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
	}
	return false;
}

export function emailIsValid(email) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const toggle = (variable) => {
	return !variable;
};

export function scrollToSection(id, e) {
	if (browser) {
		e.preventDefault();
		document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
		setTimeout(() => {
			window.location.hash = encodeURIComponent(id);
		}, 1000);
	}
}

export const checkIfInternalURL = (url) => {
	if (url) {
		let address = info.address;
		address = address.replace('https://', '');
		address = address.replace('http://', '');
		address = address.replace('www.', '');

		if (
			url.includes(address) ||
			url.startsWith('/') ||
			!(url.includes('www.') || url.includes('http://') || url.includes('https://'))
		) {
			return true;
		}
		return false;
	}
	return false;
};

// ToDo: ... There is likely a much better way to do this 😅 I'm just in a hurry
export const returnEntireSlug = (url) => {
	let address = info.address;
	let returnURL = url;
	address = address.replace('https://', '');
	address = address.replace('http://', '');
	address = address.replace('www.', '');

	returnURL = returnURL.replace('https://', '');
	returnURL = returnURL.replace('http://', '');
	returnURL = returnURL.replace('www.', '');
	returnURL = returnURL.replace(address, '');

	return returnURL;
};

export function toPlainText(blocks = []) {
	return blocks // loop through each block
		.map((block) => {
			// if it's not a text block with children,
			// return nothing
			if (block._type !== 'block' || !block.children) {
				return '';
			}
			// loop through the children spans, and join the
			// text strings
			return block.children.map((child) => child.text).join('');
		}) // join the paragraphs leaving split by two linebreaks
		.join('\n\n');
}

export function truncate(str, length, ending) {
	if (length == null) {
		length = 255;
	}
	if (ending == null) {
		ending = '...';
	}
	if (str.length > length) {
		return str.substring(0, length - ending.length) + ending;
	}
	return str;
}

export function slugify(string) {
	const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;';
	const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------';
	const p = new RegExp(a.split('').join('|'), 'g');

	return string
		.toString()
		.toLowerCase()
		.replace(/\s+/g, '-') // Replace spaces with -
		.replace(p, (c) => b.charAt(a.indexOf(c))) // Replace special characters
		.replace(/&/g, '-and-') // Replace & with 'and'
		.replace(/[^\w-]+/g, '') // Remove all non-word characters
		.replace(/--+/g, '-') // Replace multiple - with single -
		.replace(/^-+/, '') // Trim - from start of text
		.replace(/-+$/, ''); // Trim - from end of text
}

export function unSlugify(string, uppercase = false) {
	if (typeof string !== 'string') {
		return '';
	}

	if (uppercase) {
		return string
			.replace(/([_-])/g, ' ')
			.split(' ')
			.map((s) => s.charAt(0).toUpperCase() + s.substring(1))
			.join(' ');
	}

	return string.replace(/([_-])/g, ' ');
}

export function mergeArrays(
	filterFunction = (x) => {
		x;
	},
	...arrays
) {
	let preFilterJointArray = [];

	arrays.forEach((array) => {
		preFilterJointArray = [...preFilterJointArray, ...array];
	});

	const jointArray = [];
	preFilterJointArray.forEach((each) => {
		jointArray.push(filterFunction(each));
	});

	const uniqueArray = jointArray.reduce((newArray, item) => {
		if (newArray.includes(item)) {
			return newArray;
		}
		return [...newArray, item];
	}, []);
	return uniqueArray;
}

export function massageTopics(unmassagedTopics) {
	let topics = [];
	unmassagedTopics.forEach((eachTopics) => {
		topics = mergeArrays(slugify, topics, eachTopics.topics);
	});
	topics.sort();

	return topics;
}

export const capitalize = (s) => {
	if (typeof s !== 'string') return '';
	return s.charAt(0).toUpperCase() + s.slice(1);
};

export const categoryNamesToString = (categories, format = false) => {
	let arr = [];
	categories.forEach((category) => {
		arr.push(category.pageInfo.name);
	});

	if (format) {
		let returnArr = arr.join(', ');
		return returnArr.replace(/,(?=[^,]*$)/, ', and');
	}

	return arr.join();
};

export const authorNamesToString = (authors, format = false) => {
	let arr = [];
	authors.forEach((author) => {
		arr.push(author.pageInfo.name);
	});

	if (format) {
		let returnArr = arr.join(', ');
		return returnArr.replace(/,(?=[^,]*$)/, ', and');
	}

	return arr.join();
};

export const loadImage = (url) => {
	return new Promise((fulfil, reject) => {
		const img = new Image();
		img.onerror = reject;
		img.onload = () => fulfil(img);

		img.src = url;
	});
};
