export default function ServerError(props: { error: any }) {
  return (
    <>
      <div class="container">
        <div class="title">Server Error</div>

        <span>{props.error.message}</span>
      </div>
    </>
  )
}