export default function NotFound({ error }: { error: { message: string } }) {
  return (
    <>
      <h1>{error.message}</h1>
    </>
  )
}
