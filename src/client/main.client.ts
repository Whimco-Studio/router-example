import { connectWebSocket } from "@rbxts/router";
import { HttpService } from "@rbxts/services";
import { routerClient } from "shared/routes/routerClient";

const ws = connectWebSocket<{ message: string }>("chat/lobby");

ws.onMessage((data) => {
	print("📩 Server says:", data.message);
});

task.delay(1, () => {
	ws.send({ message: HttpService.JSONEncode({ info: "Hello from client!" }) });
});

task.delay(10, () => {
	ws.unsubscribe();
	print("🔌 Disconnected");
});

print(
	routerClient["character:create"]({
		id: "123",
	}),
);
