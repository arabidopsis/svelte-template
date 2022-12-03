// npm install -D @types/plotly.js
import { writable } from 'svelte/store';
import type Plotly from 'plotly.js'
declare type PlotlyLib = typeof Plotly

export const PlotlyLib = writable<null | PlotlyLib>(null);
