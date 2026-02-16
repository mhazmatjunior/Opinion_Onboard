export default function PrivacyPage() {
    return (
        <div className="container-custom py-12 max-w-3xl">
            <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
            <div className="prose prose-gray dark:prose-invert">
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                <p>
                    Your privacy is important to us. It is Opinion Onboard's policy to respect your privacy regarding any information we may collect from you across our website.
                </p>
                <h3>1. Information We Collect</h3>
                <p>
                    We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.
                </p>
                <h3>2. Use of Information</h3>
                <p>
                    We use the information we collect to operate and maintain our website, send you marketing communications (if you have opted in), and respond to your comments and questions.
                </p>
                <h3>3. Data Security</h3>
                <p>
                    We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.
                </p>
                <p className="italic text-muted-foreground">
                    (This is a placeholder Privacy Policy page for demonstration purposes.)
                </p>
            </div>
        </div>
    );
}
