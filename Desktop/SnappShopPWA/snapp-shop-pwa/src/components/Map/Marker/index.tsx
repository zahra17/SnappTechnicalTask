import React from 'react'
import dynamic from 'next/dynamic'

function MarkerLoader(props: any) {
  const MarkerWithNoSSR = dynamic(
    () => import('@components/Map/Marker/Marker'),
    {
      ssr: false,
    }
  )

  return <MarkerWithNoSSR {...props} />
}
export default React.memo(MarkerLoader)
