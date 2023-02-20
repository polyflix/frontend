import { useKeycloak } from '@react-keycloak/web'

const Secured = () => {
  const { keycloak } = useKeycloak()

  return (
    <div>
      <h1 className="text-black text-4xl">Welcome to the Protected Page.</h1>
      <pre>
        <code>{JSON.stringify(keycloak, null, ' ')}</code>
      </pre>
    </div>
  )
}

export default Secured
