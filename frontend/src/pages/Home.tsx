import { Link } from "react-router-dom";
import Button from "../components/Button";

function Home() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-white">
            {/* Navbar */}
            <header className="sticky top-0 z-10 h-20 bg-white/80 backdrop-blur-md shadow-sm flex justify-between items-center px-6 sm:px-12">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    ChatSphere
                </h1>
                <div className="flex gap-4">
                    <Button variant="outline" className="px-4 py-2">
                        <Link to="/login">Login</Link>
                    </Button>
                    <Button className="px-4 py-2">
                        <Link to="/signup">Sign up</Link>
                    </Button>
                </div>
            </header>

            {/* Hero Section */}
            <main className=" h-[80vh]  flex flex-col items-center justify-center text-center px-6 py-16">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                        Connect with <span className="text-blue-600">Everyone</span>
                    </h2>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Secure, real-time messaging for friends, teams, and communities.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Button size="lg">
                            <Link to="/signup">Get Started</Link>
                        </Button>
                        <Button variant="outline" size="lg">
                            <Link to="/login">Try Demo</Link>
                        </Button>
                    </div>
                </div>
            </main>

            {/* Features Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
                        Why Choose ChatSphere?
                    </h3>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Real-time Chat",
                                desc: "Instant messaging with read receipts and typing indicators",
                                icon: "💬"
                            },
                            {
                                title: "Media Sharing",
                                desc: "Send files, images and videos with ease",
                                icon: "📁"
                            },
                            {
                                title: "Group Chats",
                                desc: "Create spaces for teams, friends or communities",
                                icon: "👥"
                            }
                        ].map((feature) => (
                            <div
                                key={feature.title}
                                className="p-8 rounded-xl border border-gray-100 hover:border-blue-100 hover:shadow-lg transition-all"
                            >
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <h4 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h4>
                                <p className="text-gray-600">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <footer className="bg-gray-900 text-white py-16">
                <div className="max-w-4xl mx-auto text-center px-6">
                    <h3 className="text-3xl font-bold mb-6">Ready to get started?</h3>
                    <p className="text-xl text-gray-300 mb-8">
                        Join thousands of users connecting on ChatSphere today
                    </p>
                    <Button size="lg" className="mx-auto">
                        <Link to="/signup">Sign Up Free</Link>
                    </Button>
                </div>
            </footer>
        </div>
    );
}

export default Home;