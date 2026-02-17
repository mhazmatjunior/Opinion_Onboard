import { Metadata } from "next";
import { MessageSquare, Shield, Users, Heart, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
    title: "About Us | Opinion Onboard",
    description: "A platform for honest voices. Speak your truth or find someone who already did.",
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
            {/* Hero Section - Centered & Bold */}
            <section className="relative py-16 md:py-32 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 -z-10 skew-y-3 transform origin-top-left scale-110 opacity-50" />
                <div className="container-custom max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
                    <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tighter leading-tight max-w-5xl mx-auto">
                        The most important opinions are rarely the ones <br className="hidden md:block" />
                        <span className="text-primary relative inline-block">
                            spoken loudest.
                            <svg className="absolute w-full h-2 md:h-3 -bottom-1 left-0 text-primary/20 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                            </svg>
                        </span>
                    </h1>
                    <div className="prose prose-lg md:prose-xl dark:prose-invert mx-auto text-muted-foreground pt-6 md:pt-8 leading-relaxed max-w-4xl px-4">
                        <p>
                            They are the ones held quietly by people who witnessed something real, experienced something significant, or carry a perspective that deserves to be on record, but never had a credible, safe, and serious platform to place it.
                        </p>
                        <p className="font-bold text-foreground text-xl md:text-2xl pt-4">
                            Opinion Onboard was built to be exactly that platform.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content Grid */}
            <div className="container-custom max-w-6xl mx-auto py-12 md:py-16 space-y-16 md:space-y-24 px-4 md:px-6">

                {/* Feature: Post or Discover */}
                <section className="grid md:grid-cols-12 gap-8 md:gap-12 items-center">
                    <div className="md:col-span-7 space-y-4 md:space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                            <MessageSquare className="w-4 h-4" />
                            <span>Connection</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Post or discover.</h2>
                        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                            You can come here to speak or to listen. Write your own opinion and put it out into the world,
                            or browse what others are saying and find the words that match what's been sitting in the back of your mind.
                        </p>
                        <p className="text-base md:text-lg text-foreground border-l-4 border-primary pl-4 md:pl-6 py-1 italic">
                            When something resonates, vote it up. That's not just engagement, that's you saying
                            <strong> "yes, this too, this is what I mean."</strong>
                        </p>
                    </div>
                    <div className="md:col-span-5 bg-card p-6 md:p-8 rounded-2xl md:rounded-3xl border border-border/60 shadow-lg md:rotate-1 md:hover:rotate-0 transition-transform duration-500 mt-6 md:mt-0">
                        <div className="space-y-4 text-center">
                            <Heart className="w-10 h-10 md:w-12 md:h-12 text-primary mx-auto opacity-80" />
                            <p className="text-lg md:text-xl font-medium italic">
                                "The most honest opinions rise to the top. Not because of algorithms or promotions,
                                but because real people recognised something true in them."
                            </p>
                        </div>
                    </div>
                </section>

                {/* Privacy & Identity Section */}
                <section className="relative bg-muted/30 rounded-2xl md:rounded-[3rem] p-6 md:p-16 border border-border/50 overflow-hidden">
                    <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    <div className="text-center max-w-2xl mx-auto mb-8 md:mb-16 relative z-10 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-bold">Your identity, your choice.</h2>
                        <p className="text-base md:text-lg text-muted-foreground">
                            Post openly and stand behind your words, or post anonymously and let your message speak for itself.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 md:gap-8 relative z-10">
                        <div className="group bg-background p-6 md:p-8 rounded-xl md:rounded-2xl border border-border shadow-sm hover:border-primary/50 transition-colors">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-success/10 rounded-xl flex items-center justify-center text-success mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                                <Shield className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                            <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">Verified Accounts</h3>
                            <p className="text-sm md:text-base text-muted-foreground">Keep the platform honest. Build a reputation for your thoughts.</p>
                        </div>
                        <div className="group bg-background p-6 md:p-8 rounded-xl md:rounded-2xl border border-border shadow-sm hover:border-primary/50 transition-colors">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                                <Users className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                            <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">Anonymous Toggle</h3>
                            <p className="text-sm md:text-base text-muted-foreground">Keeps you safe. The public never sees who posted anonymously.</p>
                        </div>
                    </div>
                </section>

                {/* Audience Section */}
                <section className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
                    <div className="order-2 md:order-1 flex flex-wrap gap-2 md:gap-3 justify-center md:justify-start">
                        {["Employees", "Students", "Patients", "Professionals", "The Quietly Frustrated", "The Loudly Concerned"].map((item, i) => (
                            <span
                                key={item}
                                className="px-3 md:px-5 py-2 md:py-3 bg-card rounded-full border border-border shadow-sm text-sm md:text-base font-medium hover:border-primary/50 transition-colors cursor-default"
                                style={{ animationDelay: `${i * 100}ms` }}
                            >
                                {item}
                            </span>
                        ))}
                    </div>
                    <div className="order-1 md:order-2 space-y-4 md:space-y-6 text-center md:text-left">
                        <h2 className="text-3xl md:text-5xl font-bold">Who it's for.</h2>
                        <p className="text-lg md:text-xl text-muted-foreground">
                            Anyone sitting on a feeling they haven't been able to name yet.
                        </p>
                        <div className="h-1 w-20 bg-primary rounded-full mx-auto md:mx-0" />
                    </div>
                </section>

                {/* Moderation Policy */}
                <section className="bg-card border border-border rounded-2xl p-6 md:p-12 flex flex-col md:flex-row gap-6 md:gap-8 items-start hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 md:w-14 md:h-14 bg-foreground/5 rounded-full flex items-center justify-center shrink-0">
                        <Shield className="w-5 h-5 md:w-7 md:h-7 text-foreground" />
                    </div>
                    <div className="space-y-3 md:space-y-4">
                        <h3 className="text-xl md:text-2xl font-bold">How we moderate</h3>
                        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                            Categories are admin-controlled. Harassment, personal attacks, and abusive content are removed.
                            Everything else stays, <strong className="text-foreground">no matter how uncomfortable</strong>,
                            because discomfort is often exactly where the truth lives.
                        </p>
                    </div>
                </section>

                {/* New Footer/CTA */}
                <section className="py-12 md:py-20 text-center space-y-6 md:space-y-8">
                    <h2 className="text-3xl md:text-6xl font-bold tracking-tight px-4">
                        Say what you mean.
                        <span className="block text-muted-foreground mt-2 text-xl md:text-4xl font-normal">
                            Or find someone who already did.
                        </span>
                    </h2>
                    <p className="text-lg md:text-xl font-medium text-primary">Either way, you are home.</p>
                </section>
            </div>
        </div>
    );
}
