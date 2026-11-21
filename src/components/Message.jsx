// Small coloured box for errors ("error") and info messages ("info").
function Message({ type = 'error', children }) {
  if (!children) return null
  return <div className={`message message-${type}`}>{children}</div>
}

export default Message
