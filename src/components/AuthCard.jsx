// The white box with a title that wraps the login and signup forms.
function AuthCard({ title, subtitle, children }) {
  return (
    <div className="page">
      <div className="card">
        <h1>{title}</h1>
        {subtitle && <p className="subtitle">{subtitle}</p>}
        {children}
      </div>
    </div>
  )
}

export default AuthCard
