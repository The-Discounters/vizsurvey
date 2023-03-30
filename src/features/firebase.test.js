import { getId, getServerSequenceId } from "./firebase.js";

describe("Firebase test", () => {
  const generatedSequences = [];

  // convert an array to a set and convert back
  function getUniqueArray(arr) {
    return [...new Set(arr)];
  }

  function isUnique(arr) {
    return getUniqueArray(arr).length === arr.length;
  }

  afterAll(() => {
    console.log("unique ids are:" + generatedSequences);
    expect(isUnique(generatedSequences)).toBe(true);
  });

  test("Validate getId.", async () => {
    const id = await getId();
    expect(Number.isInteger(id)).toBe(true);
  });

  test("Validate getServerSequenceId produces sequential ids when called serially.", async () => {
    const sequence1 = await getServerSequenceId();
    console.log("sequence1: " + sequence1);
    const sequence2 = await getServerSequenceId();
    console.log("sequence2: " + sequence2);

    expect(sequence2).toBe(sequence1 + 1);
  });

  test.concurrent(
    "validate that we generate unique sequence with concurrent calls 1",
    async () => {
      const sequence = await getServerSequenceId();
      generatedSequences.push(sequence);
    }
  );

  test.concurrent(
    "validate that we generate unique sequence with concurrent calls 2",
    async () => {
      const sequence = await getServerSequenceId();
      generatedSequences.push(sequence);
    }
  );

  test.concurrent(
    "validate that we generate unique sequence with concurrent calls 3",
    async () => {
      const sequence = await getServerSequenceId();
      generatedSequences.push(sequence);
    }
  );
});
