const Footer = () => {
    return (
        <footer className="bg-primary shadow ">
            <div className="w-full max-w-screen-xl mx-auto md:py-8 p-8">
                <div className="flex flex-col items-center sm:flex-row sm:justify-center">
                    <a href="/" className="flex items-center space-x-2 mb-6">
                        <img src="/andes-blue.svg" className="h-14" alt="JUCO Logo" />
                    </a>
                </div>
                <span className="block text-sm text-white text-center">Sin derechos reservados.</span>
            </div>
        </footer>
    );
};

export default Footer;
