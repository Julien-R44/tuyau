import { Link, useRouter } from '../tuyau/index'

export default function Home() {
  return (
    <>
      <div className="hero">
        <h1>It works — welcome to the power of a full-stack React app</h1>
        <p>
          Powered by Inertia and React, this setup blends server-driven routing with rich
          client-side interactivity — seamless, fast, and cohesive.
        </p>
      </div>

      <div className="cards">
        <a href="https://insiders.adonisjs.com/docs/v7-alpha/introduction" target="_blank">
          <h3>Official Docs &nbsp;›</h3>
          <p>Comprehensive reference for building with AdonisJS</p>
        </a>

        <a href="https://adocasts.com/" target="_blank">
          <h3>Adocasts &nbsp;›</h3>
          <p>Guided video tutorials for everyday development</p>
        </a>

        <a href="https://discord.gg/vDcEjq6" target="_blank">
          <h3>Discord &nbsp;›</h3>
          <p>Connect with developers building with AdonisJS every day</p>
        </a>
      </div>
    </>
  )
}
