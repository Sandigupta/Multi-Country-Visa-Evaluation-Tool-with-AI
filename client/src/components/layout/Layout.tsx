import Navbar from './Navbar';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="min-h-screen bg-background font-sans text-foreground">
            <Navbar />
            <main className="container mx-auto px-4 py-8 max-w-5xl">
                {children}
            </main>
        </div>
    );
};

export default Layout;
