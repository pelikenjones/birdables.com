import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemaTypes';
import { fetchMediaAction } from './actions/fetchMedia';
import { projectId, dataset, apiVersion } from './sanity.project';

export default defineConfig({
	name: 'default',
	title: 'Birdables',
	projectId,
	dataset,

	plugins: [structureTool(), visionTool({ defaultApiVersion: apiVersion })],

	schema: {
		types: schemaTypes
	},

	document: {
		// The media fetcher is only meaningful on a bird.
		actions: (prev, context) =>
			context.schemaType === 'bird' ? [...prev, fetchMediaAction] : prev
	}
});
