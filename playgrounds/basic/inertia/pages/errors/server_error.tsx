export default function ServerError({ error }: { error: { message: string } }) {
  return (
    <>
      <h1>{error.message}</h1>
    </>
  )
}
