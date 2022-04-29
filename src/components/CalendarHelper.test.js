describe("Icon chart tests.", () => {
  test("Test calculate index.", () => {
    const inc = 1100 / (5 * 5);
    const iconIdx = Math.floor(500 / inc);
    expect(iconIdx).toBe(11);
  });
});
