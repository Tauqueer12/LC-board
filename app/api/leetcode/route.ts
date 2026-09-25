import { NextResponse } from 'next/server';

const LEETCODE_GRAPHQL = 'https://leetcode.com/graphql';
const LEETCODE_HEADERS = {
    'Content-Type': 'application/json',
    'Referer': 'https://leetcode.com',
};

// Resolve a numeric problem ID to a LeetCode titleSlug using lcid.cc
async function resolveSlug(id: string): Promise<string | null> {
    try {
        const res = await fetch(`https://lcid.cc/info/${id}`);
        if (!res.ok) return null;
        const data = await res.json();
        return data?.titleSlug ?? null;
    } catch (e) {
        console.error("Error resolving slug via lcid.cc:", e);
        return null;
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Problem ID is required' }, { status: 400 });
    }

    // Guard: instantly reject anything that is not a pure number (no spaces, no letters)
    if (!/^\d+$/.test(id)) {
        return NextResponse.json({ error: 'Invalid problem ID format. Must be a pure number.' }, { status: 400 });
    }

    // Resolve the numeric ID to a slug via lcid.cc
    const titleSlug = await resolveSlug(id);
    if (!titleSlug) {
        return NextResponse.json({ error: `Could not find a problem with number ${id}` }, { status: 404 });
    }

    const query = `
        query questionData($titleSlug: String!) {
            question(titleSlug: $titleSlug) {
                content
            }
        }
    `;

    try {
        const response = await fetch(LEETCODE_GRAPHQL, {
            method: 'POST',
            headers: LEETCODE_HEADERS,
            body: JSON.stringify({ query, variables: { titleSlug } }),
        });

        if (!response.ok) {
            throw new Error(`LeetCode API responded with status ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data.data);
    } catch (error) {
        console.error("Error in Next.js API route:", error);
        return NextResponse.json({ error: 'Failed to fetch from LeetCode' }, { status: 500 });
    }
}
