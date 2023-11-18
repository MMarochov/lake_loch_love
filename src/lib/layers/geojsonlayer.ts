import type { FeatureCollection, Feature } from 'geojson';
import type { Map } from 'maplibre-gl';
import type { Layer } from './layer';

export type GeoJsonType = 'fill' | 'line' | 'symbol' | 'circle' | 'fill-extrusion';

export class GeoJsonLayer implements Layer {
	id: string;
	displayName: string;
	type: GeoJsonType;
	map: Map | null;
	data: FeatureCollection;
	paint: any;
	options?: any;

	constructor(
		id: string,
		displayName: string,
		data: FeatureCollection,
		type: GeoJsonType,
		paint: any,
		options?: any
	) {
		this.id = id;
		this.displayName = displayName;
		this.map = null;
		this.data = data;
		this.type = type;
		this.paint = paint;
		this.options = options;
	}

	setMap(map: Map) {
		this.map = map;

		this.map.addSource(this.id, {
			type: 'geojson',
			data: { type: 'FeatureCollection', features: [] }
		});

		this.map.addLayer({
			id: this.id,
			type: this.type,
			source: this.id,
			layout: { visibility: 'visible' },
			paint: this.paint,
			...this.options
		});

		return this;
	}

	render() {
		if (!this.map) return;
		this.map.getSource(this.id)?.setData(this.data);
	}

	isVisible(): boolean {
		if (!this.map) return false;
		return this.map.getLayoutProperty(this.id, 'visibility') === 'visible';
	}

	toggle(): void {
		if (!this.map) return;
		if (this.isVisible()) {
			this.map.setLayoutProperty(this.id, 'visibility', 'none');
		} else {
			this.map.setLayoutProperty(this.id, 'visibility', 'visible');
		}
	}

	filter(predicate: (feature: Feature) => boolean): void {
		if (!this.map) return;

		const features = this.data.features.filter(predicate);
		const data = { type: 'FeatureCollection', features };
		this.map.getSource(this.id)?.setData(data);
	}
}
