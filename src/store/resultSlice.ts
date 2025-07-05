// store/resultSlice.ts
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface ResultState {
  data: any
  updatedJD: string
}

const initialState: ResultState = {
  data: null,
  updatedJD: '',
}

export const resultSlice = createSlice({
  name: 'result',
  initialState,
  reducers: {
    setResult: (state, action: PayloadAction<any>) => {
      state.data = action.payload.analysis
      state.updatedJD = action.payload.updated_jd
    },
    clearResult: (state) => {
      state.data = null;
      state.updatedJD = '';
    },
  },
})

export const { setResult, clearResult } = resultSlice.actions
export default resultSlice.reducer
