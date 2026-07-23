export default function Spinner({ label = 'Loading' }) {
  return (
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">{label}</span>
    </div>
  )
}
