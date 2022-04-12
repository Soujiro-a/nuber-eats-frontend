describe("Create Account", () => {
  it("이메일, 비밀번호 검증, 이미 존재하는 계정일 경우에 발생하는 오류 메시지를 확인합니다.", () => {
    cy.visit("/");
    cy.findByText("계정 생성하기").click();
    cy.findByPlaceholderText("Email").type("not@allowed");
    cy.findByText("유효한 이메일을 입력해주세요");
    cy.findByPlaceholderText("Email").clear();
    cy.findByText("이메일은 필수 입력 항목입니다");
    cy.findByPlaceholderText("Email").type("client@account.com");
    cy.findByPlaceholderText("Password").type("1234").clear();
    cy.findByText("비밀번호는 필수 입력 항목입니다");
    cy.findByPlaceholderText("Password").type("1234");
    cy.findByRole("button").click();
    cy.findByText("해당 이메일을 가진 사용자가 이미 존재합니다.");
  });
  it("새 계정을 만들고 해당 계정으로 로그인을 진행합니다.", () => {
    cy.intercept("http://localhost:4000/graphql", (req) => {
      const { operationName } = req.body;
      if (operationName && operationName === "createAccountMutation") {
        req.reply((res) => {
          res.send({
            data: {
              createAccount: {
                ok: true,
                error: null,
                __typename: "CreateAccountOutput",
              },
            },
          });
        });
      }
    });
    cy.visit("/create-account");
    cy.findByPlaceholderText("Email").type("client@account.com");
    cy.findByPlaceholderText("Password").type("1234");
    cy.findByRole("button").click();
    cy.wait(1000);
    cy.title().should("eq", "Login | Nuber Eats");
    cy.findByRole("button").click();
    cy.assertLoggedIn();
  });
});
