# :pushpin: Nuber Eats

> [우버 이츠 클론코딩](https://nomadcoders.co/nuber-eats) 강의 프론트엔드 파트 결과물

## :calendar: 1. 제작 기간 & 참여 인원

- 2022.03.17 ~
- 개인 프로젝트

## :computer: 2. 사용 기술

- React.js
- TailwindCSS
- Apollo
- React Hook Form
- apollo-tooling
- React Testing Library
- Jest
- Cypress

## :dart: 3. 구현 기능

<details>
<summary>Components</summary>
<div markdown="1">

- [App](https://github.com/Soujiro-a/nuber-eats-frontend/blob/main/src/components/app.tsx)
- [Header](https://github.com/Soujiro-a/nuber-eats-frontend/blob/main/src/components/header.tsx)
- [Button](https://github.com/Soujiro-a/nuber-eats-frontend/blob/main/src/components/button.tsx)
- [Category Icon](https://github.com/Soujiro-a/nuber-eats-frontend/blob/main/src/components/category.tsx)
- [Error Form](https://github.com/Soujiro-a/nuber-eats-frontend/blob/main/src/components/form-error.tsx)
- [Display Page](https://github.com/Soujiro-a/nuber-eats-frontend/blob/main/src/components/page.tsx)
- [Restaurant](https://github.com/Soujiro-a/nuber-eats-frontend/blob/main/src/components/restaurant.tsx)

</div>
</details>

<details>
<summary>Page</summary>
<div markdown="1">

- [Logged-out-routers](https://github.com/Soujiro-a/nuber-eats-frontend/blob/main/src/routers/logged-out-router.tsx)
  - [404 Not Found](https://github.com/Soujiro-a/nuber-eats-frontend/blob/main/src/pages/404.tsx)
  - [Create Account](https://github.com/Soujiro-a/nuber-eats-frontend/blob/main/src/pages/create-account.tsx)
  - [Log in](https://github.com/Soujiro-a/nuber-eats-frontend/blob/main/src/pages/login.tsx)
- [Logged-in-routers](https://github.com/Soujiro-a/nuber-eats-frontend/blob/main/src/routers/logged-in-router.tsx)
  - User
    - [Confirm Email](https://github.com/Soujiro-a/nuber-eats-frontend/blob/main/src/pages/user/confirm-email.tsx)
    - [Edit Profile](https://github.com/Soujiro-a/nuber-eats-frontend/blob/main/src/pages/user/edit-profile.tsx)
  - Client
    - Restaurants
    - Restaurant
    - Search
    - Category
  - Owner
    - Create Restaurant
    - My Restaurants
    - My Restaurant
    - Create Dish

</div>
</details>

<details>
<summary>Hooks</summary>
<div markdown="1">

- [useMe](https://github.com/Soujiro-a/nuber-eats-frontend/blob/main/src/hooks/useMe.tsx)
- [usePage](https://github.com/Soujiro-a/nuber-eats-frontend/blob/main/src/hooks/usePage.tsx)
- [useQueryParams](https://github.com/Soujiro-a/nuber-eats-frontend/blob/main/src/hooks/useQueryParams.tsx)

</div>
</details>

<details>
<summary>Test</summary>
<div markdown="1">

- Unit Test
  - Components
    - [App](https://github.com/Soujiro-a/nuber-eats-frontend/blob/main/src/components/__tests__/app.spec.tsx)
    - [Header](https://github.com/Soujiro-a/nuber-eats-frontend/blob/main/src/components/__tests__/header.spec.tsx)
    - [Button](https://github.com/Soujiro-a/nuber-eats-frontend/blob/main/src/components/__tests__/button.spec.tsx)
    - [Category Icon](https://github.com/Soujiro-a/nuber-eats-frontend/blob/main/src/components/__tests__/category.spec.tsx)
    - [Error Form](https://github.com/Soujiro-a/nuber-eats-frontend/blob/main/src/components/__tests__/form-error.spec.tsx)
    - [Display Page](https://github.com/Soujiro-a/nuber-eats-frontend/blob/main/src/components/__tests__/page.spec.tsx)
    - [Restaurant](https://github.com/Soujiro-a/nuber-eats-frontend/blob/main/src/components/__tests__/restaurant.spec.tsx)
  - Pages
- Cypress E2E Test
  - Auth
    - [Create Account](https://github.com/Soujiro-a/nuber-eats-frontend/blob/main/cypress/integration/auth/create-account.ts)
    - [Log in](https://github.com/Soujiro-a/nuber-eats-frontend/blob/main/cypress/integration/auth/login.ts)
  - User
    - [Edit Profile](https://github.com/Soujiro-a/nuber-eats-frontend/blob/main/cypress/integration/user/edit-profile.ts)

</div>
</details>

## :rotating_light: 4. 트러블 슈팅

<details>
<summary>react-helmet 적용 시 발생한 경고 메시지</summary>
<div markdown="1">

> Warning: Using UNSAFE_componentWillMount in strict mode is not recommended and may indicate bugs in your code.

strict mode에서 UNSAFE_componentWillMount를 사용하는걸 권장하지 않고, 가끔 내 코드에서 버그가 발생할 수도 있다는 문구다.

마침 내 상황이랑 똑같은 오류를 작성해준 [블로그](https://ywtechit.tistory.com/174) 포스팅이 있었다.

기존에 `react-helmet`패키지를 사용하여 구성했었는데, `react-helmet-async`패키지로 바꾸어서 Helmet 태그 위에 HelmetProvider 태그로 감싸주어 경고 메시지를 지울 수 있었다.

</div>
</details>

<details>
<summary>계정 생성 후 로그인 페이지에 계정과 비밀번호가 미리 입력되도록 하기</summary>
<div markdown="1">

해당 프로젝트에서는 react-router-dom v6을 쓰고 있기 때문에, useHistory를 더 이상 지원하지 않았고, useNavigate로 사용해야했다.
useNavigate의 첫번째 매개변수와, 두번째 매개변수의 replace 옵션을 활용하여 원하는 url로 이동할 수 있다.
이동할 때, 두번째 매개변수의 state 옵션을 사용하여, 원하는 값들을 특정 url로 이동할 때 같이 넘겨줄 수 있다.
이것을 사용할 컴포넌트 쪽에서 useLocation으로 값을 받아서 사용할 수 있다.

그런데, typescript로 구성하고 있다보니, 처음 타입 설정에 문제가 있어서 제대로 적용되지가 않는 오류가 났었다.
createAccount에서 넘겨준 값들을 form의 기본값으로 설정해주려고했는데, Location 클래스의 state 옵션은 기본적으로 unknown으로 설정되어 있기 때문에, 타입 에러가 발생했었다.
그래서 state 옵션의 타입 설정을 위한 인터페이스를 만들어주어, useLocation을 불러올 때 as를 이용해 인터페이스를 붙여주었다.

결과적으로, useLocation으로 불러온 변수에 state 값이 있으면 넣어주고, 없으면 빈 값으로 설정되게끔 하였다.

</div>
</details>

<details>
<summary>React Component Testing 중, custom hook이 mocking이 안되던 문제</summary>
<div markdown="1">

apollo client의 useQuery를 사용하는 custom hook을 사용중인데, 로그인 라우터들을 테스팅할 때 문제가 발생했었다.
로그인 라우터들은 해당 페이지가 렌더링되자마자, useQuery를 사용하여 사용자 정보를 가져오는 쿼리를 보내 정보를 받아오게끔 하고 있는데, 해당 쿼리 값을 mocking이 되지 않는 문제가 발생했다.

처음에는 Header 컴포넌트를 테스팅할 때 처럼 mockedProvider를 사용하여, 쿼리 값을 mocking하려고 했다. ([참고 링크](https://github.com/Soujiro-a/nuber-eats-frontend/blob/e66fef1e65b1f1775393205213e960ee30762474/src/components/__tests__/header.spec.tsx#L10))
그런데, Header 컴포넌트 단일 테스트처럼 쿼리 하나만 mocking 하는거면 상관이 없는데, 버튼을 클릭하여 다른 쿼리를 보내는 작업도 있었기 때문에, 해당 쿼리 값도 mocking 해주어야해서, 해당 방법을 사용하기에 적절하지 않았고, 잘 되지도 않았다.

꽤나 오랫동안 고민했던 문제였지만, 의외로 해결방법은 간단했다.
페이지를 render하기전에 미리 쿼리에 mocking할 값을 설정해두는 것이었다.

이 방법을 바로 떠올리지 못한 이유는, 이전의 페이지나 컴포넌트들을 테스팅할때는 (mockedProvider를 사용하지 않았을 때를 제외하고) 페이지가 렌더링되자마자 쿼리를 보낸 적이 없어서 항상 렌더링 후에 쿼리 값을 mocking하는 작업을 해주었었기때문에, 유연한 사고를 하지 못했던게 원인이라고 생각된다.

</div>
</details>
