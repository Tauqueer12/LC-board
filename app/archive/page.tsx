'use client'
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/app/components/custom/firebase-auth';
import { getUserData } from '@/app/components/custom/firebase-utils';
import Link from 'next/link';

interface BoardEntry {
    id: string;
    content?: string;
    sceneVersion?: number;
}

export default function Library() {
    const [boards, setBoards] = useState<BoardEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user && user.uid) {
                setUserId(user.uid);
                try {
                    const data = await getUserData(user.uid);
                    setBoards(data || []);
                } catch (e) {
                    console.error('Error fetching boards:', e);
                }
            } else {
                setUserId(null);
                setBoards([]);
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
                <title>Archive</title>
                <div className="flex flex-col items-center">
                    <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-500 animate-pulse font-medium">Loading your boards...</p>
                </div>
            </div>
        );
    }

    if (!userId) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
                <title>Archive</title>
                <div className="text-center p-8 rounded-lg shadow-lg ring-1 ring-gray-900/5 max-w-md mx-auto">
                    <svg className="mx-auto mb-4 w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <h2 className="text-xl font-semibold mb-2">Sign in to view your boards</h2>
                    <p className="text-gray-500 mb-4">Your saved whiteboards will appear here once you log in.</p>
                    <Link
                        href="/login"
                        className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    >
                        Log In
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-8rem)] px-4 py-8 max-w-4xl mx-auto">
            <title>Archive</title>

            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-1">Your Boards</h1>
                <p className="text-gray-500 text-sm">All your saved whiteboards in one place</p>
            </div>

            {boards.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                    <svg className="mx-auto mb-4 w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p className="text-lg font-medium">No boards yet</p>
                    <p className="text-sm mt-1">Start solving problems to see them here!</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {boards.map((board) => (
                        <Link
                            key={board.id}
                            href={`/problems/${board.id}`}
                            className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/50 transition-colors">
                                    <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                        {board.id}
                                    </p>
                                    {board.sceneVersion && (
                                        <p className="text-xs text-gray-400">
                                            Scene version: {board.sceneVersion}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <svg
                                className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    ))}
                </div>
            )}

            <p className="text-center text-xs text-gray-400 mt-8">
                {boards.length} board{boards.length !== 1 ? 's' : ''} found
            </p>
        </div>
    );
}