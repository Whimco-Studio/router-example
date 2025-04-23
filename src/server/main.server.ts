import { createMockWebSocket } from "@rbxts/router/out/core/websocket";
import "./apps";

createMockWebSocket("chat/lobby", (data) => {
	data.onMessage((message) => {
		print("📩 Client says:", message);
		data.send({ message: "Hello from server!" });
	});

	data.onClose(() => {
		print("🔌 Disconnected");
	});
});
