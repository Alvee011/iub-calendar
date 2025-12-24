import React from 'react';
import { Mail } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="mt-auto py-8 text-center text-slate-500 text-sm border-t border-slate-200 bg-slate-50/50">
            <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-3">
                <p className="text-slate-700 font-medium">
                    © IUB Academic Calendar 2026 | Designed By Faruque Azam Alvee
                </p>

                <a
                    href="https://alvee.bio.link/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold hover:underline transition-colors"
                >
                    <Mail size={16} />
                    Contact Me
                </a>
            </div>
        </footer>
    );
}
