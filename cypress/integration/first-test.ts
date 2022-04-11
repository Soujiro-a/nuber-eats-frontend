describe("First Test", () => {
  it("홈페이지로 가야합니다.", () => {
    cy.visit("http://localhost:3000")
      .title()
      .should("eq", "Login | Nuber Eats");
  });
});
