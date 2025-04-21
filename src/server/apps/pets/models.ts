import { t } from "@rbxts/t";

export const PetSchema = t.interface({
	id: t.string,
	ownerUserId: t.number,
	name: t.string,
	type: t.keyOf({ cat: true, dog: true, bird: true }),
	level: t.number,
});

export type Pet = t.static<typeof PetSchema>;
