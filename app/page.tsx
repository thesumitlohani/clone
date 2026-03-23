"use client";

import { useState, useRef, useEffect } from "react";

export default function Home() {
const [messages, setMessages] = useState<any[]>([]);
const [input, setInput] = useState("");
const [streamingText, setStreamingText] = useState("");
const bottomRef = useRef<HTMLDivElement>(null);

useEffect(() => {
bottomRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages, streamingText]);

const sendMessage = async () => {
if (!input) return;

const newMessages = [...messages, { role: "user", content: input }];
setMessages(newMessages);
setInput("");
setStreamingText("");

const res = await fetch("/api/chat", {
method: "POST",
body: JSON.stringify({ messages: newMessages }),
});

const reader = res.body?.getReader();
const decoder = new TextDecoder();

let result = "";

while (true) {
const { done, value } = await reader!.read();
if (done) break;

result += decoder.decode(value);
setStreamingText(result);
}

setMessages([...newMessages, { role: "assistant", content: result }]);
setStreamingText("");
};

return (
<main className="flex flex-col h-screen bg-black text-white">
<div className="flex-1 overflow-y-auto max-w-3xl mx-auto w-full p-4">
{messages.map((m, i) => (
<div key={i} className="mb-4">
<div className="text-sm text-gray-400">{m.role}</div>
<div>{m.content}</div>
</div>
))}

{streamingText && (
<div className="mb-4">
<div className="text-sm text-gray-400">assistant</div>
<div>
{streamingText}
<span className="animate-pulse">|</span>
</div>
</div>
)}

<div ref={bottomRef} />
</div>

<div className="border-t border-gray-700 p-4">
<div className="max-w-3xl mx-auto flex gap-2">
<input
className="flex-1 p-3 rounded bg-gray-800 outline-none"
value={input}
onChange={(e) => setInput(e.target.value)}
/>
<button
onClick={sendMessage}
className="px-4 bg-white text-black rounded"
>
Send
</button>
</div>
</div>
</main>
);
}