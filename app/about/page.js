"use client"
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function About() {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedTheme = localStorage.getItem("darkMode");
            if (savedTheme === "true") {
                setDarkMode(true);
                document.documentElement.classList.add("dark");
            }
        }
    }, []);

    return (
        <div className={`min-h-screen transition-colors ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-orange-50 via-purple-50 to-orange-100'} p-6`}>
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className={`text-5xl font-bold mb-4 drop-shadow-lg ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
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
                <div className={`rounded-lg shadow-xl p-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    {/* Creator */}
                    <div className="mb-8">
                        <h2 className={`text-2xl font-bold mb-3 flex items-center ${darkMode ? 'text-purple-400' : 'text-purple-700'}`}>
                            👤 Creator
                        </h2>
                        <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Jadon Huang</p>
                        <a
                            href="https://github.com/j-jh/onlytreats"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-block px-6 py-2 rounded-lg shadow-md transition-colors ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-800 text-white hover:bg-gray-900'}`}
                        >
                            GitHub
                        </a>
                    </div>

                    {/* Dependencies */}
                    <div>
                        <h2 className={`text-2xl font-bold mb-4 flex items-center ${darkMode ? 'text-purple-400' : 'text-purple-700'}`}>
                            📦 Dependencies
                        </h2>
                        <ul className="space-y-3">
                            <li className={`flex items-center px-4 py-3 rounded-lg border-l-4 ${darkMode ? 'bg-orange-900 text-orange-100 border-orange-600' : 'bg-orange-50 text-gray-800 border-orange-500'}`}>
                                <span className="font-semibold mr-2">React</span>
                                <span className={darkMode ? 'text-orange-300' : 'text-gray-600'}>19.2.x</span>
                            </li>
                            <li className={`flex items-center px-4 py-3 rounded-lg border-l-4 ${darkMode ? 'bg-purple-900 text-purple-100 border-purple-600' : 'bg-purple-50 text-gray-800 border-purple-500'}`}>
                                <span className="font-semibold mr-2">Next.js</span>
                                <span className={darkMode ? 'text-purple-300' : 'text-gray-600'}>16.0.x</span>
                            </li>
                            <li className={`flex items-center px-4 py-3 rounded-lg border-l-4 ${darkMode ? 'bg-orange-900 text-orange-100 border-orange-600' : 'bg-orange-50 text-gray-800 border-orange-500'}`}>
                                <span className="font-semibold mr-2">OpenAI API</span>
                                <span className={darkMode ? 'text-orange-300' : 'text-gray-600'}>6.7.x</span>
                            </li>
                            <li className={`flex items-center px-4 py-3 rounded-lg border-l-4 ${darkMode ? 'bg-purple-900 text-purple-100 border-purple-600' : 'bg-purple-50 text-gray-800 border-purple-500'}`}>
                                <span className="font-semibold mr-2">data.sfgov.org</span>
                            </li>
                            <li className={`flex items-center px-4 py-3 rounded-lg border-l-4 ${darkMode ? 'bg-orange-900 text-orange-100 border-orange-600' : 'bg-orange-50 text-gray-800 border-orange-500'}`}>
                                <span className="font-semibold mr-2">Tailwind CSS</span>
                                <span className={darkMode ? 'text-orange-300' : 'text-gray-600'}>4.1.x</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}