/**
 * Minimal example React component.
 * TODO: Replace with actual landing page content.
 */
export function WelcomeCard({ title, subtitle, description }) {
  return (
    <div className="bg-white rounded-lg shadow p-8 max-w-md">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <p className="text-gray-600 mt-1">{subtitle}</p>
      <p className="text-sm text-gray-500 mt-4">{description}</p>
    </div>
  )
}
