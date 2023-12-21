import { getRandomIntInclusive } from "./randomUtil.js";

describe("parseCSV test.", () => {
  test("Test getRandomIntInclusive.", () => {
    let value = getRandomIntInclusive(0, 0);
    expect(value).toBe(0);
    expect(Number.isInteger(value)).toBe(true);
    value = getRandomIntInclusive(0, 1);
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThanOrEqual(1);
    value = getRandomIntInclusive(3, 3);
    expect(value).toBeGreaterThanOrEqual(3);
    expect(value).toBeLessThanOrEqual(3);
    value = getRandomIntInclusive(0, 1000000000);
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThanOrEqual(1000000000);
  });

  // I used this test to gather some data on what the random generation of treatment id distribution looked like.
  // test("Test getRandomIntInclusive distribution.", () => {
  //   //const treatmentIds = new Array();
  //   const distributions = new Array();
  //   for (let j = 1; j <= 100; j++) {
  //     const treatmentDist = [0, 0, 0];
  //     for (let i = 1; i <= 100; i++) {
  //       let value = getRandomIntInclusive(1, 3);
  //       expect(value).toBeGreaterThanOrEqual(1);
  //       expect(value).toBeLessThanOrEqual(3);
  //       //treatmentIds.push(value);
  //       treatmentDist[value - 1] = treatmentDist[value - 1] + 1;
  //     }
  //     //console.log(treatmentIds);
  //     console.log(treatmentDist);
  //     distributions.push(treatmentDist);
  //   }
  //   const distStr = distributions.reduce((acc, cv) => {
  //     return acc + `${cv[0]},${cv[1]},${cv[2]}\n`;
  //   }, "count1, count2, count3\n");
  //   fs.writeFileSync("getRandomIntInclusive-dist.csv", distStr);
  // });
  // I used this test to gather some data on what the random generation of treatment id distribution looked like.
  // test("Test getRandomIntInclusive distribution single execution.", () => {
  //   let value = getRandomIntInclusive(1, 3);
  //   fs.appendFileSync("getRandomIntInclusive-dist-single.txt", `${value}\n`);
  // });
});
