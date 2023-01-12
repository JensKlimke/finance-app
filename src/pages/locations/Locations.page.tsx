import {useEffect, useState} from "react";
import Map, {PositionType} from "./Map";

export default function LocationsPage () {
  // states
  const [positions, setPositions] = useState<PositionType[]>();
  // effects
  useEffect(() => {
    fetch('https://middleware.jens-klimke.de/home/locations?token=abcdefgh')
      .then(res => res.json())
      .then(p => setPositions(p))
  }, []);
  // render
  return <Map positions={positions}/>
}
