import { useState } from "react";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export default function Producer() {
    const [message, setMessage] = useState("");
    const [response, setResponse] = useState("");

    const sendMessage = async () => {
        const finalMessage = message + "menu";

        try {
            const res = await fetch(
                `${API}/producer/menu?message=${encodeURIComponent(finalMessage)}`
            );

            const data = await res.text();

            setResponse(data);
            setMessage("");
        } catch (err) {
            setResponse(`Error al contactar el productor (${API}): ${err.message}`);
        }
    };

    return (
        <div style={{ padding: 20 }}>
        <h1>Kafka Producer</h1>

        <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe mensaje (meat, vegan...)"
            style={{
            width: "300px",
            padding: "12px",
            fontSize: "16px",
            marginRight: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc"
            }}
        />

        <button
            onClick={sendMessage}
            style={{
            padding: "12px 20px",
            fontSize: "16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
            }}
        >
            Enviar a Kafka
        </button>

        {response && (
            <div style={{ marginTop: "20px" }}>
            <h3>Respuesta:</h3>
            <p>{response}</p>
            </div>
        )}
        </div>
    );
}