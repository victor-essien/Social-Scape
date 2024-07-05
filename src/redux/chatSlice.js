import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chatId: null,
  },
  reducers: {
    setChatId: (state, action) => {
      state.chatId = action.payload;
    },
  },
});

export const { setChatId } = chatSlice.actions;
export default chatSlice.reducer;
