import { Head } from '@inertiajs/react'
import { Link } from '@tuyau/inertia/react'

export default function Home() {
  return (
    <>
      <Head title="Create post" />

      <div className="container">
        <p>Create post</p>
        <Link route="home"></Link>
      </div>
    </>
  )
}
