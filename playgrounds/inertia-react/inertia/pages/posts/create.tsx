import { Head } from '@inertiajs/react'
import { Link, useRouter } from '@tuyau/inertia/react'

export default function Home() {
  const router = useRouter()

  return (
    <>
      <Head title="Create post" />
      <div className="container">
        <button
          onClick={() =>
            router.visit({
              route: 'home',
            })
          }
        >
          Go to home
        </button>
        <p>Create post</p>
        <Link route="home"></Link>
      </div>
    </>
  )
}
