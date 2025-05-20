import Navbar from "../components/common/Navbar";
import LinksPage from "../components/sections/DocumentationSection";
import { useEffect } from "react";

const DocumentationPage = () => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        document.title = 'Dockyard - Digital Solutions';
    }, []);

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />
            <h1 className="text-3xl font-bold">Documentation</h1>
            <p className="mt-4">This is the documentation page.</p>
            <LinksPage />
        </div>
    );
}

export default DocumentationPage;