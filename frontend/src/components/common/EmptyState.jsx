import { MESSAGES } from '../../constants/messages'

export default function EmptyState({ message = MESSAGES.EMPTY }) {
  return (
    <div className="text-center text-muted py-4">
      {message}
    </div>
  )
}
