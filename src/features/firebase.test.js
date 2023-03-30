import { getId } from "./firebase.js";

describe("Firebase test", () => {
  test("Validate getId I need to get this working.", async () => {
    const sequence = await getId();
    expect(sequence).toBe(0);
  });
});
