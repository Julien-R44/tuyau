import { Head } from '@inertiajs/react'
import { Link } from '@tuyau/inertia/react'

export default function Home(props: { version: number }) {
  return (
    <>
      <Head title="Homepage" />

      <div className="container">
        <div className="title">AdonisJS {props.version} x Inertia x React</div>

        <Link route="posts.create">Go Post create</Link>
        <Link route="posts_comments.create" params={{ postId: 1 }}>
          Create comment for post 1
        </Link>

        <span>
          Learn more about AdonisJS and Inertia.js by visiting the{' '}
          <a href="https://docs.adonisjs.com/guides/inertia">AdonisJS documentation</a>.
        </span>
      </div>
    </>
  )
}
