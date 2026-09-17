import type { SchemaTypeDefinition } from 'sanity';
import { mediaCredit } from './objects/mediaCredit';
import { bird } from './documents/bird';
import { card } from './documents/card';
import { post } from './documents/post';
import { rarityTier } from './documents/rarityTier';
import { nomination } from './documents/nomination';
import { subscriber } from './documents/subscriber';
import { siteSettings } from './singletons/siteSettings';

export const schemaTypes: SchemaTypeDefinition[] = [
	mediaCredit,
	bird,
	card,
	post,
	rarityTier,
	nomination,
	subscriber,
	siteSettings
];
