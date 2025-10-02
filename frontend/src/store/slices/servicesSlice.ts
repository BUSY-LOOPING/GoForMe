import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { ServicesState } from '../../types';
import { serviceService } from '../../services/serviceService';

const initialState: ServicesState = {
  services: [], 
  categories: [],
  selectedService: null,
  isLoading: false,
  error: null,
};

export const fetchServices = createAsyncThunk('services/fetchServices', async () => {
  let res = await serviceService.getServices();
  return res;
});

export const fetchServiceCategories = createAsyncThunk(
  'services/fetchCategories',
  async () => {
    let res = await serviceService.getServiceCategories();
    return res;
  }
);


const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    selectService: (state, action) => {
      state.selectedService = action.payload;
    },
    clearSelectedService: (state) => {
      state.selectedService = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.services = Array.isArray(action.payload) ? action.payload : []; 
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch services';
        state.services = []; 
      })
      .addCase(fetchServiceCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchServiceCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchServiceCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.categories = []; 
      });
  },
});

export const { selectService, clearSelectedService } = servicesSlice.actions;
export default servicesSlice.reducer;
