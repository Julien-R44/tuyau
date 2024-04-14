
export default function Home(props: { version: number }) {
  return (
    <>
      <div class="container">
        <div class="title">AdonisJS {props.version} x Inertia x Solid.js</div>

        <span>
          Learn more about AdonisJS and Inertia.js by visiting the{' '}
          <a href="https://docs.adonisjs.com/guides/inertia">AdonisJS documentation</a>.
        </span>
      </div>
    </>
  )
}