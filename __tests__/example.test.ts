describe("Example Test Suite", () => {
  it("should pass basic arithmetic test", () => {
    expect(2 + 2).toBe(4);
  });

  it("should handle string operations", () => {
    const projectName = "Peleti";
    expect(projectName).toContain("Pel");
    expect(projectName).toHaveLength(6);
  });

  it("should work with arrays", () => {
    const materials = ["resina", "pigmentos", "molduras"];
    expect(materials).toHaveLength(3);
    expect(materials).toContain("resina");
  });
});
