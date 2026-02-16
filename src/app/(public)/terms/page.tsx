export default function TermsPage() {
    return (
        <div className="container-custom py-12 max-w-3xl">
            <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
            <div className="prose prose-gray dark:prose-invert">
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                <p>
                    Welcome to Opinion Onboard. By using our website, you agree to these Terms of Service.
                </p>
                <h3>1. Acceptance of Terms</h3>
                <p>
                    By accessing or using Opinion Onboard, you agree to be bound by these Terms and all applicable laws and regulations.
                </p>
                <h3>2. User Conduct</h3>
                <p>
                    You agree to use the service only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the website.
                </p>
                <h3>3. Content</h3>
                <p>
                    You retain your rights to any content you submit, post or display on or through the Services. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, copy, reproduce, process, adapt, modify, publish, transmit, display and distribute such content.
                </p>
                <p className="italic text-muted-foreground">
                    (This is a placeholder Terms of Service page for demonstration purposes.)
                </p>
            </div>
        </div>
    );
}
