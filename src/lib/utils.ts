/** Ported from the v1 SvelteKit app (src/lib/utils.js) — behaviour unchanged. */

export function slugify(input: string): string {
	const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;';
	const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------';
	const p = new RegExp(a.split('').join('|'), 'g');

	return input
		.toString()
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(p, (c) => b.charAt(a.indexOf(c)))
		.replace(/&/g, '-and-')
		.replace(/[^\w-]+/g, '')
		.replace(/--+/g, '-')
		.replace(/^-+/, '')
		.replace(/-+$/, '');
}

export function unSlugify(input: string, uppercase = false): string {
	if (typeof input !== 'string') return '';

	if (uppercase) {
		return input
			.replace(/([_-])/g, ' ')
			.split(' ')
			.map((s) => s.charAt(0).toUpperCase() + s.substring(1))
			.join(' ');
	}

	return input.replace(/([_-])/g, ' ');
}

type PortableTextBlock = {
	_type: string;
	children?: Array<{ text?: string }>;
};

export function toPlainText(blocks: PortableTextBlock[] = []): string {
	return blocks
		.map((block) => {
			if (block._type !== 'block' || !block.children) return '';
			return block.children.map((child) => child.text ?? '').join('');
		})
		.join('\n\n');
}

export function truncate(str: string, length = 255, ending = '...'): string {
	if (str.length > length) {
		return str.substring(0, length - ending.length) + ending;
	}
	return str;
}

/** Intl-formatted integer, for scan counts and print runs. */
export function formatCount(n: number): string {
	return new Intl.NumberFormat('en-US').format(n);
}
