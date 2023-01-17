import React, {useEffect, useState} from "react";
import {load} from '@2gis/mapgl';
import { Directions } from '@2gis/mapgl-directions';

export const Map = () => {

    const queryParams = new URLSearchParams(window.location.search);
    const croods = queryParams.get('croods');

    const [currentCoords, setCurrentCoords] = useState([]);
    const [destinationCoords, setDestinationCoords] = useState([]);

    const MapWrapper = React.memo(
        () => {
            return <div id="map-container" style={{ width: '100%', height: '100%' }}></div>;
        },
        () => true,
    )

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(function(position) {
            setCurrentCoords([position.coords.latitude, position.coords.longitude])
        }, function(error) {
            setCurrentCoords([79.858734, 7.189464])
            if(croods){
                setDestinationCoords([parseFloat(croods.split(',')[0]), parseFloat(croods.split(',')[1])])
            } else{
                setDestinationCoords([])
            }
          });
    }, []);
    
    useEffect(() => {
        let map;
        if(currentCoords.length > 0){
            load().then((mapgl) => {
                map = new mapgl.Map('map-container', {
                    center: currentCoords,
                    zoom: 10
                    ,
                    key: 'bfd8bbca-8abf-11ea-b033-5fa57aae2de7',
                    zoomControl: false,
                });
    
                const currentLocation = new mapgl.Marker(map, {
                    coordinates: currentCoords,
                    label: {
                        text: "Current Location",
                        offset: [0, 10],
                        relativeAnchor: [0.5, 0],
                    },
                });
    
                const destinationLocation = new mapgl.Marker(map, {
                    coordinates: destinationCoords,
                    icon: 'https://docs.2gis.com/img/mapgl/marker.svg',
                    label: {
                        text: "Destination Location",
                        offset: [0, 10],
                        relativeAnchor: [0.5, 0],
                    },
                });
            });
    
            const directions = new Directions(map, {
                directionsApiKey: 'bfd8bbca-8abf-11ea-b033-5fa57aae2de7',
            });
    
            directions.carRoute({
                points: [
                    currentCoords,
                    destinationCoords
                ],
            });
        }

        return () => map && map.destroy();
    }, [currentCoords, destinationCoords]);

    return (
        <div style={{ width: '100%', height: '100%' }}>
           { currentCoords.length > 0 &&
            <MapWrapper />}
        </div>
    );
};