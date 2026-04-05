# CDRI Books (도서 검색)

## 프로젝트 개요

카카오 **도서 검색 Open API**를 사용하는 React 기반 웹 앱입니다. 검색어·상세 검색(제목·ISBN·출판사·저자 등 대상 지정)으로 도서를 조회하고, **무한 스크롤**로 다음 페이지를 이어서 불러옵니다. 목록에서 도서를 펼쳐 요약을 보거나 **찜**을 눌러 두고, 별도 **찜 목록** 페이지에서 모아 볼 수 있습니다. 찜 데이터는 **브라우저 로컬 스토리지**에 저장됩니다.

## 실행 방법

### 요구 사항

- [Node.js](https://nodejs.org/) (LTS 권장, 예: 20.x 이상)
- [pnpm](https://pnpm.io/) 10.x (`package.json`의 `packageManager`와 동일 버전 권장)

### 설치 및 스크립트

```bash
pnpm install
pnpm dev          # 개발 서버 (http://localhost:5173 등)
pnpm build        # 타입 검사 후 프로덕션 빌드
pnpm preview      # 빌드 결과 미리보기
pnpm lint         # ESLint
pnpm format       # Prettier 저장
pnpm test         # Vitest (watch)
pnpm test:run     # Vitest 일회 실행
pnpm test:coverage  # 커버리지 리포트 (text, html)
```

## 폴더 구조 및 주요 코드 설명

```
src/
├── apis/                 # 카카오 도서 검색 API 호출, axios 인스턴스
├── app.tsx               # 라우트 정의 (홈 / 찜)
├── main.tsx              # 엔트리, QueryClientProvider
├── pages/                # 화면 단위 (홈: 검색+결과 상태, 찜 목록)
├── components/
│   ├── @layout/          # 앱 레이아웃, 헤더·내비게이션
│   ├── @ui/              # 공용 UI (버튼 등)
│   ├── book-search/      # 검색 입력, 검색 기록, 상세 검색 팝오버
│   ├── book-search-results/  # 결과 건수, 목록 래퍼, 빈 상태
│   ├── book-list/        # 도서 리스트·아이템(접힘/펼침, 찜 버튼)
│   └── liked-books/      # 찜 페이지용 카운트·빈 상태
├── hooks/                # 검색 무한 스크롤, 검색 기록, 찜, 팝오버 등
├── stores/               # Zustand 찜 스토어 + persist
├── lib/                  # 도서 텍스트 등 순수 유틸
├── constants/            # API 경로, 라우트, 로컬스토리지 키, 페이지 크기 등
└── test/                 # Vitest 공통 setup
```

| 구역 | 역할 |
|------|------|
| `pages/home-page.tsx` | 입력값·제출된 검색어·상세 검색 `target`·펼친 행 ID 등 화면 상태를 두고 `BookSearch` / `BookSearchResults`에 전달 |
| `hooks/use-book-search-infinite.ts` | TanStack Query `useInfiniteQuery` + Intersection Observer로 다음 페이지 로드 |
| `hooks/use-search-history.ts` | 최근 검색어를 로컬 스토리지에 유지 |
| `stores/book-like-store.ts` | 찜 순서·도서 맵을 persist; 기존 저장 형식과의 호환을 위한 커스텀 storage 어댑터 포함 |

## 라이브러리 선택 이유

| 라이브러리 | 선택 이유 |
|------------|-----------|
| **Vite** | 빠른 개발 서버·HMR과 단순한 빌드 설정으로 React SPA에 적합 |
| **Axios** | 카카오 API용 인스턴스(`baseURL`, `Authorization` 헤더)를 한곳에서 구성 |
| **React Router** | 홈·찜 페이지 분리 및 레이아웃 중첩 라우트 |
| **Zustand** | 찜처럼 전역이지만 범위가 작은 클라이언트 상태에 보일러플레이트가 적고, `persist`로 로컬 저장과 잘 맞음 |
| **Tailwind CSS v4** | 유틸리티 기반으로 레이아웃·타이포를 빠르게 맞추고, `@tailwindcss/vite`로 통합 |
| **vite-plugin-svgr** | 아이콘·일러스트 SVG를 React 컴포넌트로 import |
| **Vitest + Testing Library** | Vite와 동일 생태계에서 단위·컴포넌트 테스트 및 커버리지 수집 |

## 강조하고 싶은 기능

- **상세 검색**: 제목·ISBN·출판사·저자(인물) 등 검색 대상을 지정해 카카오 API의 `target` 파라미터와 연동
- **무한 스크롤**: 스크롤 하단 감지로 다음 페이지를 요청하고, 첫 로딩·추가 로딩 상태를 구분해 표시
- **검색 기록**: 입력창과 연동된 최근 검색어 목록(로컬 스토리지), 항목 선택·삭제
- **목록 UX**: 행 확장으로 내용 요약 확인, 찜 토글과 찜 전용 페이지
- **찜 데이터 지속성**: Zustand persist + 커스텀 storage로 이전 저장 형식과의 호환을 시도해 기존 사용자 데이터 이전에 유리
- **테스트**: 검색·검색 결과·목록 아이템·훅·스토어 등에 Vitest 기반 테스트를 두어 회귀를 줄임
