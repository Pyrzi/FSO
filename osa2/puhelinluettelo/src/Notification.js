const Notification = ({ message }) => {
    if (message === null) {
      return null
    }
    if (message.includes('fail') || message.includes('already')) {
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