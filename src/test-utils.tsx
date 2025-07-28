// // test-utils.tsx
// import React from 'react'
// import type { ReactElement } from 'react'
// import { render } from '@testing-library/react'
// import type { RenderOptions } from '@testing-library/react'
// import { Provider } from 'react-redux'
// import { BrowserRouter } from 'react-router-dom'
// import { configureStore, createSlice } from '@reduxjs/toolkit'

// // Create a mock result slice for testing
// const mockResultSlice = createSlice({
//   name: 'result',
//   initialState: {
//     data: null,
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     setResult: (state, action) => {
//       state.data = action.payload
//     },
//     clearResult: (state) => {
//       state.data = null
//     },
//   },
// })

// // Create a test store with proper initial state
// const createTestStore = (preloadedState?: any) => {
//   const defaultState = {
//     result: {
//       data: null,
//       loading: false,
//       error: null,
//     }
//   }
  
//   return configureStore({
//     reducer: mockResultSlice.reducer,
//     preloadedState: preloadedState || defaultState,
//   })
// }

// // Custom render function that includes providers
// const customRender = (
//   ui: ReactElement,
//   {
//     preloadedState,
//     store = createTestStore(preloadedState),
//     ...renderOptions
//   }: {
//     preloadedState?: any
//     store?: ReturnType<typeof createTestStore>
//   } & Omit<RenderOptions, 'wrapper'> = {}
// ) => {
//   function Wrapper({ children }: { children: React.ReactNode }) {
//     return (
//       <Provider store={store}>
//         <BrowserRouter>
//           {children}
//         </BrowserRouter>
//       </Provider>
//     )
//   }

//   return render(ui, { wrapper: Wrapper, ...renderOptions })
// }

// // Re-export everything
// export * from '@testing-library/react'
// export { customRender as render }

// test-utils.tsx
import React from 'react'
import type { ReactElement } from 'react'
import { render } from '@testing-library/react'
import type { RenderOptions } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { configureStore, createSlice } from '@reduxjs/toolkit'

// Define proper types for the Redux state
interface ResultState {
  data: unknown | null;
  loading: boolean;
  error: string | null;
}

interface RootState {
  result: ResultState;
}

// Create a mock result slice for testing
const mockResultSlice = createSlice({
  name: 'result',
  initialState: {
    data: null,
    loading: false,
    error: null,
  } as ResultState,
  reducers: {
    setResult: (state, action) => {
      state.data = action.payload
    },
    clearResult: (state) => {
      state.data = null
    },
  },
})

// Create a test store with proper initial state
const createTestStore = (preloadedState?: Partial<RootState>) => {
  const defaultState: RootState = {
    result: {
      data: null,
      loading: false,
      error: null,
    }
  }
  
  return configureStore({
    reducer: mockResultSlice.reducer,
    preloadedState: preloadedState || defaultState,
  })
}

// Custom render function that includes providers
const customRender = (
  ui: ReactElement,
  {
    preloadedState,
    store = createTestStore(preloadedState),
    ...renderOptions
  }: {
    preloadedState?: Partial<RootState>
    store?: ReturnType<typeof createTestStore>
  } & Omit<RenderOptions, 'wrapper'> = {}
) => {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </Provider>
    )
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }
