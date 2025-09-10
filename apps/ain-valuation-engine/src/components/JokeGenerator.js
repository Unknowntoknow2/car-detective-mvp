import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
export function JokeGenerator() {
    const [joke, setJoke] = useState(null);
    const [loading, setLoading] = useState(false);
    async function fetchJoke() {
        setLoading(true);
        setJoke(null);
        try {
            const res = await fetch('/api/joke');
            const data = await res.json();
            setJoke({ setup: data.setup, punchline: data.punchline });
        }
        catch {
            setJoke({ setup: 'Error', punchline: 'Could not fetch joke.' });
        }
        setLoading(false);
    }
    return (_jsxs("div", { children: [_jsx("button", { onClick: fetchJoke, disabled: loading, children: loading ? 'Loading...' : 'Get Random Joke' }), joke && (_jsxs("div", { style: { marginTop: 20 }, children: [_jsx("div", { children: _jsx("strong", { children: joke.setup }) }), _jsx("div", { children: joke.punchline })] }))] }));
}
