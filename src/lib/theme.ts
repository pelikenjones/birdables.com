export const THEMES = ['light', 'dark'] as const;
export type Theme = (typeof THEMES)[number];

/** Light is the default. The toggle opts into dark and persists that choice. */
export const DEFAULT_THEME: Theme = 'light';

export const STORAGE_KEY = 'birdables:theme';

/**
 * Runs blocking in <head> so the attribute is set before first paint.
 *
 * Deliberately does NOT consult prefers-color-scheme: the approved design
 * defaults to light for everyone and dark is an explicit opt-in. To follow the
 * OS instead, fall back to matchMedia('(prefers-color-scheme: dark)') when
 * nothing is stored.
 *
 * Written out literally rather than built from STORAGE_KEY, so importing that
 * constant into a client component doesn't drag this string along with it.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('birdables:theme');if(t==='dark'||t==='light'){document.documentElement.dataset.theme=t}}catch(e){}})();`;
