import LoadingIndicator from '../LoadingIndicator'
import { MESSAGES } from '../../constants/messages'

export default function Loader({ message = MESSAGES.LOADING, fullPage = false }) {
  if (fullPage) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <LoadingIndicator message={message} />
      </div>
    )
  }

  return <LoadingIndicator message={message} />
}
