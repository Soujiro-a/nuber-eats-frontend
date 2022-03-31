# :pushpin: Nuber Eats

> [우버 이츠 클론코딩](https://nomadcoders.co/nuber-eats) 강의 프론트엔드 파트 결과물

## :calendar: 1. 제작 기간 & 참여 인원

- 2022.03.17 ~
- 개인 프로젝트

## :computer: 2. 사용 기술

- React.js
- TailwindCSS
- Apollo
- [React Hook Form](https://react-hook-form.com/)
- [apollo-tooling](https://github.com/apollographql/apollo-tooling)
- React Testing Library
- Jest

## :dart: 3. 구현 기능

<details>
<summary></summary>
<div markdown="1">

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
