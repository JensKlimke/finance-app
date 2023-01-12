import React, {useCallback, useState} from "react";
import L, {LatLngLiteral} from 'leaflet';
import {MapContainer, Marker, TileLayer, Tooltip} from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import './map.css';

import icon from './star.svg';
import {Card} from "react-bootstrap";

let DefaultIcon = L.icon({
  iconUrl: icon,
  iconSize:     [10, 10],
  iconAnchor:   [5, 5],
  popupAnchor:  [5, 5]
});

L.Marker.prototype.options.icon = DefaultIcon;

const position : LatLngLiteral = {
  lat: 49.4666,
  lng: 8.3501
}

export type PositionType = {
  lat: number
  lon: number
  device: string
  location?: string
}

export default function Map({positions} : {positions: PositionType[] | undefined}) {
  // info
  const [info, setInfo] = useState<string>();
  // callbacks
  const handleClick = useCallback((i: number, ) => {

  }, []);
  // render
  return (
    <Card>
      <Card.Header>{info}</Card.Header>
      <Card.Body>
        Info: {info?.split(', ')}
      </Card.Body>
      <MapContainer center={position} zoom={5} scrollWheelZoom={true} >
        <TileLayer
          url='https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png'
          // @ts-ignore
          maxZoom={20}
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        />
        {
          positions && positions.map((p, i) => (
            <Marker
              key={i}
              position={{lat: p.lat, lng: p.lon}}
              eventHandlers={{
                click: (e : any) => {
                  fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${e.latlng.lat}&lon=${e.latlng.lng}`)
                    .then(r => r.json())
                    .then(r => setInfo(r.display_name));
                },
              }}
            >
              <Tooltip>{info}</Tooltip>
            </Marker>
          ))
        }
      </MapContainer>
    </Card>
  )
}
