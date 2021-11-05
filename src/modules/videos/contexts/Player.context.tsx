import { createContext, PropsWithChildren, useState } from 'react'

export interface IPlayerContext {
  lastSync: number | undefined
  setLastSync: (value: number) => void
}

export const PlayerContext = createContext<IPlayerContext | undefined>(
  undefined
)

export const PlayerProvider = ({ children }: PropsWithChildren<{}>) => {
  const [lastSync, setLastSync] = useState<number | undefined>()

  return (
    <PlayerContext.Provider
      value={{
        lastSync,
        setLastSync,
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}
