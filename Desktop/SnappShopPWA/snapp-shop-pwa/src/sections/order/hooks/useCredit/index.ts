import {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'

import {isAPIResponse} from '@api'
import requests from '~order/endpoints'
import {selectUser} from '@slices/core'

const useCredit = () => {
  const [credit, setCredit] = useState(0)

  const user = useSelector(selectUser)

  useEffect(() => {
    if (!user) return
    requests
      .fetchCredit<{data: {credit: number}; status: boolean}>()
      .then(res => {
        if (isAPIResponse(res) && res.status === 200 && res.data.status) {
          setCredit(res.data.data?.credit ?? 0)
        }
      })
      .catch()
  }, [])

  return credit
}

export default useCredit
