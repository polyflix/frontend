import { CircularProgress, Divider } from '@mui/material'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Header } from '@core/components/Header/Header.component'
import { Page } from '@core/components/Page/Page.component'

import { Link } from 'react-router-dom'
import { User } from '@users/models/user.model'

type Props = {
  user: User | undefined
}

export const ProfileRecommendationsPage: React.FC<Props> = ({
  user,
}: Props) => {
  const { t } = useTranslation('users')
  const [isLoading, setIsLoading] = useState(true)
  const [ItemsSimilarityNeo4j, setItemsSimilarityNeo4j] = useState([] as any)
  const [ItemsSimilarityTinkerpop, setItemsSimilarityTinkerpop] = useState(
    [] as any
  )
  const [FeatureOverlappingNeo4j, setFeatureOverlappingNeo4j] = useState(
    [] as any
  )
  const [FeatureOverlappingTinkerpop, setFeatureOverlappingTinkerpop] =
    useState([] as any)
  const [UserItemsSimilarityNeo4j, setUserItemsSimilarityNeo4j] = useState(
    [] as any
  )
  const [UserItemsSimilarityTinkerpop, setUserItemsSimilarityTinkerpop] =
    useState([] as any)
  const [UserBasedNeo4j, setUserBasedNeo4j] = useState([] as any)
  const [UserBasedTinkerpop, setUserBasedTinkerpop] = useState([] as any)
  const [ItemBasedNeo4j, setItemBasedNeo4j] = useState([] as any)
  const [ItemBasedTinkerpop, setItemBasedTinkerpop] = useState([] as any)
  const [Hybrid, setHybrid] = useState([] as any)

  useEffect(() => {
    fetch(
      `https://hybrid-recommender.hugoamalric.fr/recommendations/${user?.id}`
    )
      .then((response) => {
        // handle the response data
        response.json().then((json) => {
          setFeatureOverlappingNeo4j(json['FeatureOverlapping']['Neo4j'])
          setFeatureOverlappingTinkerpop(
            json['FeatureOverlapping']['Tinkerpop']
          )
          setItemsSimilarityNeo4j(json['ItemsSimilarity']['Neo4j'])
          setItemsSimilarityTinkerpop(json['ItemsSimilarity']['Tinkerpop'])
          setUserItemsSimilarityNeo4j(json['UserItemsSimilarity']['Neo4j'])
          setUserItemsSimilarityTinkerpop(
            json['UserItemsSimilarity']['Tinkerpop']
          )
          setUserBasedNeo4j(json['UserBased']['Neo4j'])
          setUserBasedTinkerpop(json['UserBased']['Tinkerpop'])
          setItemBasedNeo4j(json['ItemBased']['Neo4j'])
          setItemBasedTinkerpop(json['ItemBased']['Tinkerpop'])
          setHybrid(json['Hybrid'])
        })
        setIsLoading(false)
      })
      .catch((error) => {
        // handle the error
        console.error(error)
        setIsLoading(false)
      })
  }, [])

  return (
    <Page disableGutters={true} title={'Mes recommandations'} sx={{ mt: 3 }}>
      <Header
        title={'Mes recommandations'}
        description={'Mes recommandations'}
      />

      <Divider sx={{ my: 3 }} />

      {isLoading ? (
        <CircularProgress sx={{ mx: 'auto', display: 'block' }} />
      ) : (
        <>
          <>
            <h2>Hybrid</h2>
            <ul>
              {Hybrid.map((video: any) => (
                <li>
                  <Link to={`/videos/${video.id}`}>{video.id}</Link>
                </li>
              ))}
            </ul>
          </>
          <>
            <h2>FeatureOverlapping</h2>
            <h3>Neo4j</h3>
            <ul>
              {FeatureOverlappingNeo4j.map((video: any) => (
                <li>
                  <Link to={`/videos/${video.id}`}>{video.id}</Link>
                </li>
              ))}
            </ul>
            <h3>Tinkerpop</h3>
            <ul>
              {FeatureOverlappingTinkerpop.map((video: any) => (
                <li>
                  <Link to={`/videos/${video.id}`}>{video.id}</Link>
                </li>
              ))}
            </ul>
          </>
          <>
            <h2>ItemsSimilarity</h2>
            <h3>Neo4j</h3>
            <ul>
              {ItemsSimilarityNeo4j.map((video: any) => (
                <li>
                  <Link to={`/videos/${video.id}`}>{video.id}</Link>
                </li>
              ))}
            </ul>
            <h3>Tinkerpop</h3>
            <ul>
              {ItemsSimilarityTinkerpop.map((video: any) => (
                <li>
                  <Link to={`/videos/${video.id}`}>{video.id}</Link>
                </li>
              ))}
            </ul>
          </>
          <>
            <h2>UserItemsSimilarity</h2>
            <h3>Neo4j</h3>
            <ul>
              {UserItemsSimilarityNeo4j.map((video: any) => (
                <li>
                  <Link to={`/videos/${video.id}`}>{video.id}</Link>
                </li>
              ))}
            </ul>
            <h3>Tinkerpop</h3>
            <ul>
              {UserItemsSimilarityTinkerpop.map((video: any) => (
                <li>
                  <Link to={`/videos/${video.id}`}>{video.id}</Link>
                </li>
              ))}
            </ul>
          </>

          <>
            <h2>UserBased</h2>
            <h3>Neo4j</h3>
            <ul>
              {UserBasedNeo4j.map((video: any) => (
                <li>
                  <Link to={`/videos/${video.id}`}>{video.id}</Link>
                </li>
              ))}
            </ul>
            <h3>Tinkerpop</h3>
            <ul>
              {UserBasedTinkerpop.map((video: any) => (
                <li>
                  <Link to={`/videos/${video.id}`}>{video.id}</Link>
                </li>
              ))}
            </ul>
          </>

          <>
            <h2>ItemBased</h2>
            <h3>Neo4j</h3>
            <ul>
              {ItemBasedNeo4j.map((video: any) => (
                <li>
                  <Link to={`/videos/${video.id}`}>{video.id}</Link>
                </li>
              ))}
            </ul>
            <h3>Tinkerpop</h3>
            <ul>
              {ItemBasedTinkerpop.map((video: any) => (
                <li>
                  <Link to={`/videos/${video.id}`}>{video.id}</Link>
                </li>
              ))}
            </ul>
          </>
        </>
      )}
    </Page>
  )
}
