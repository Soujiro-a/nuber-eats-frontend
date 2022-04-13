describe("Edit Profile", () => {
  beforeEach(() => {
    cy.login("client@account.com", "1234");
    cy.get('a[href="/edit-profile"]').click();
  });
  it("헤더에 버튼을 클릭하여 프로필 수정 페이지로 이동합니다.", () => {
    cy.assertTitle("Edit Profile");
  });
  it("이메일을 변경합니다.", () => {
    cy.intercept("POST", "http://localhost:4000/graphql", (req) => {
      const { operationName } = req.body;
      if (operationName && operationName === "editProfile") {
        // @ts-ignore
        req.body?.variables?.input?.email = "client@account.com";
      }
    });
    cy.findByPlaceholderText("Email").clear().type("new@account.com");
    cy.findByPlaceholderText("Password").type("1234");
    cy.findByRole("button").click();
  });
});
