describe("Log In", () => {
  it("로그인 페이지로 가야합니다.", () => {
    cy.visit("/").title().should("eq", "Login | Nuber Eats");
  });
  it("이메일, 비밀번호 검증 오류 메시지를 확인합니다.", () => {
    cy.visit("/");
    cy.findByPlaceholderText("Email").type("not@allowed");
    cy.findByText("유효한 이메일을 입력해주세요");
    cy.findByPlaceholderText("Email").clear();
    cy.findByText("이메일은 필수 입력 항목입니다");
    cy.findByPlaceholderText("Email").type("test@account.com");
    cy.findByPlaceholderText("Password").type("1234").clear();
    cy.findByText("비밀번호는 필수 입력 항목입니다");
  });
  it("로그인을 진행합니다.", () => {
    cy.visit("/");
    cy.findByPlaceholderText("Email").type("client@account.com");
    cy.findByPlaceholderText("Password").type("1234");
    cy.findByRole("button")
      .should("not.have.class", "pointer-events-none")
      .click();
    cy.window().its("localStorage.nuber-token").should("be.a", "string");
  });
});
