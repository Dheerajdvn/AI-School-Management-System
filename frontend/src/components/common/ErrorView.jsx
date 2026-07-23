import ErrorBanner from '../ErrorBanner'
import { MESSAGES } from '../../constants/messages'

export default function ErrorView({ message = MESSAGES.ERROR }) {
  return <ErrorBanner message={message} />
}
