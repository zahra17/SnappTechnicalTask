import React from 'react'
import dynamic from 'next/dynamic'

function MapLoader(props: any) {
  const Map = React.useMemo(
    () =>
      dynamic(
        () => import('@components/Map/SFMap'), // replace '@components/map' with your component's location
        {
          loading: function loader() {
            return (
              <div
                style={{
                  height: props.height || '50vh',
                  backgroundColor: 'var(--gray2-color)',
                }}
              />
            )
          },
          ssr: false, // This line is important. It's what prevents server-side render
        }
      ),
    [props.center, props.dragging]
  )
  return <Map {...props} />
}

export default React.memo(MapLoader)
