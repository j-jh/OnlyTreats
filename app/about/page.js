"use client"
import Link from 'next/link';

export default function About() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-orange-100 p-6">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold text-orange-600 mb-4 drop-shadow-lg">
                        🎃About OnlyTreats👻
                    </h1>
                    <Link
                        href="/"
                        className="inline-block px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md"
                    >
                        Back to Home
                    </Link>
                </div>

                {/* Content Card */}
                <div className="bg-white rounded-lg shadow-xl p-8">
                    {/* Creator */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-purple-700 mb-3 flex items-center">
                            👤 Creator
                        </h2>
                        <p className="text-gray-800 text-lg">Jadon Huang</p>
                        <a
                            href="https://github.com/j-jh/onlytreats"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-6 py-2 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-900 transition-colors"
                        >
                            GitHub
                        </a>
                    </div>

                    {/* Dependencies */}
                    <div>
                        <h2 className="text-2xl font-bold text-purple-700 mb-4 flex items-center">
                            📦 Dependencies
                        </h2>
                        <ul className="space-y-3">
                            <li className="flex items-center text-gray-800 bg-orange-50 px-4 py-3 rounded-lg border-l-4 border-orange-500">
                                <span className="font-semibold mr-2">React</span>
                                <span className="text-gray-600">19.2.x</span>
                            </li>
                            <li className="flex items-center text-gray-800 bg-purple-50 px-4 py-3 rounded-lg border-l-4 border-purple-500">
                                <span className="font-semibold mr-2">Next.js</span>
                                <span className="text-gray-600">16.0.x</span>
                            </li>
                            <li className="flex items-center text-gray-800 bg-orange-50 px-4 py-3 rounded-lg border-l-4 border-orange-500">
                                <span className="font-semibold mr-2">OpenAI API</span>
                                <span className="text-gray-600">6.7.x</span>
                            </li>
                            <li className="flex items-center text-gray-800 bg-purple-50 px-4 py-3 rounded-lg border-l-4 border-purple-500">
                                <span className="font-semibold mr-2">data.sfgov.org</span>
                            </li>
                            <li className="flex items-center text-gray-800 bg-orange-50 px-4 py-3 rounded-lg border-l-4 border-orange-500">
                                <span className="font-semibold mr-2">Tailwind CSS</span>
                                <span className="text-gray-600">4.1.x</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}