import type { RouteContext } from "@rbxts/router";
import type { Pet } from "./models";

export function createPet({ payload, player }: RouteContext<Pet>) {
	print(`${player.Name} created ${payload.name}`);
	return { success: true };
}

export function listPets() {
	return { success: true, data: ["Fluffy", "Shadow"] };
}
