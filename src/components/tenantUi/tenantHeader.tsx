type HeaderProps = {
    title: string;
}

export default function TenantHeader({ title }: HeaderProps) {
    return (
        <header className="p-4">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        </header>
    )
}