import { useEffect } from 'react'

const Notification = ({ message, setMessage }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
          setMessage(null)
        }, 3000)
        return () => clearTimeout(timer)
      }, )
    
    if (message === null) {
      return null
    }
    if (/fail|already|wrong|missing/.test(message)) {
        return (
            <div className="error">
            {message}
            </div>
        )
    }
    return (
      <div className="successful">
        {message}
      </div>
    )
  }

export default Notification