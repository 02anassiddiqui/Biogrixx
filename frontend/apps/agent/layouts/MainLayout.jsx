export default function MainLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col font-sans">
            <main className="flex-1">{children}</main>
        </div>
    )
}