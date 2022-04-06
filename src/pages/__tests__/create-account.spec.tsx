import { CreateAccount, CREATE_ACCOUNT_MUTATION } from "../create-account";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import { ApolloProvider } from "@apollo/client";
import { render, waitFor, screen } from "../../test-utils";
import userEvent from "@testing-library/user-event";
import { UserRole } from "../../api/globalTypes";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => {
  const realModule = jest.requireActual("react-router-dom");
  return {
    ...realModule,
    useNavigate: () => mockNavigate,
  };
});

describe("<CreateAccount />", () => {
  let mockedClient: MockApolloClient;
  beforeEach(() => {
    mockedClient = createMockClient();
    // eslint-disable-next-line testing-library/no-render-in-setup
    render(
      <ApolloProvider client={mockedClient}>
        <CreateAccount />
      </ApolloProvider>
    );
  });
  it("계정 생성 페이지가 렌더링 됩니다.", async () => {
    await waitFor(() => {
      expect(document.title).toBe("Create Account | Nuber Eats");
    });
  });
  it("이메일 작성 시 발생하는 에러를 표시합니다.", async () => {
    const email = screen.getByPlaceholderText("Email");
    userEvent.type(email, "this@wrong");
    await waitFor(() => {
      screen.getByText("유효한 이메일을 입력해주세요");
    });
    userEvent.clear(email);
    await waitFor(() => {
      screen.getByText("이메일은 필수 입력 항목입니다");
    });
  });
  it("비밀번호 미작성 시 발생하는 에러를 표시합니다.", async () => {
    const email = screen.getByPlaceholderText("Email");
    userEvent.type(email, "this@correct.com");
    const submitButton = screen.getByRole("button");
    userEvent.click(submitButton);
    await waitFor(() => {
      screen.getByText("비밀번호는 필수 입력 항목입니다");
    });
  });
  it("이메일, 비밀번호 작성 후 확인 버튼을 눌렀을 때 실제 처리를 불러옵니다.", async () => {
    const email = screen.getByPlaceholderText("Email");
    const password = screen.getByPlaceholderText("Password");
    const formData = {
      email: "test@email.com",
      password: "1234",
      role: UserRole.Client,
    };
    const mockedMutationResponse = jest.fn().mockResolvedValue({
      data: {
        createAccount: {
          ok: true,
          error: "mutation-test-error", // error 부분 테스팅을 위한 임의 값 설정
        },
      },
    });
    mockedClient.setRequestHandler(
      CREATE_ACCOUNT_MUTATION,
      mockedMutationResponse
    );
    jest.spyOn(window, "alert").mockImplementation(() => null);
    userEvent.type(email, formData.email);
    userEvent.type(password, formData.password);
    const submitButton = screen.getByRole("button");
    userEvent.click(submitButton);
    await waitFor(() => {
      expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
    });
    expect(mockedMutationResponse).toHaveBeenCalledWith({
      createAccountInput: {
        email: formData.email,
        password: formData.password,
        role: formData.role,
      },
    });
    screen.getByText("mutation-test-error");
    expect(window.alert).toHaveBeenCalledWith(
      "계정을 생성하였습니다. 로그인 화면으로 이동합니다"
    );
    expect(mockNavigate).toHaveBeenCalledWith("/", {
      replace: true,
      state: { email: formData.email, password: formData.password },
    });
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
