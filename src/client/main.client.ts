import { handleRoute } from "@rbxts/router";

const inputService = game.GetService("UserInputService");

inputService.InputBegan.Connect((input, gameProcessedEvent) => {
	if (gameProcessedEvent) return;

	if (input.KeyCode === Enum.KeyCode.E) {
		handleRoute("pets:create", game.GetService("Players").LocalPlayer, {
			name: "Fluffy",
			type: "cat",
			level: 1,
		});
	}
});
