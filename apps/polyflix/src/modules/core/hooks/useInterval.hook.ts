import React, { useEffect, useRef } from 'react'

/**
 * Execute the callback function every @param delayms
 *
 * @param callback callback function
 * @param delayms delay in milliseconds
 */
export const useInterval = (callback: () => void, delayms: number) => {
  const savedCallback: React.MutableRefObject<any> = useRef()

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    const tick = () => {
      savedCallback.current()
    }
    if (delayms !== null) {
      let id = setInterval(tick, delayms)
      return () => clearInterval(id)
    }
  }, [delayms])
}
