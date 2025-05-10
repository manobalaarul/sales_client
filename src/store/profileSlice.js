import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
  company_name: "",
  address: "",
  stock: "",
  phone: "",
  gstNo: "",
  gstPer: "",
  logo: "",
};

const profileSlice = createSlice({
  name: "profile",
  initialState: initialValue,
  reducers: {
    setProfileDetails: (state, action) => {
      state.company_name = action.payload?.company_name;
      state.address = action.payload?.address;
      state.stock = action.payload?.stock;
      state.phone = action.payload?.phone;
      state.gstNo = action.payload?.gstNo;
      state.gstPer = action.payload?.gstPer;
      state.logo = action.payload?.logo;
    },
  },
});

export const { setProfileDetails } = profileSlice.actions;

export default profileSlice.reducer;
