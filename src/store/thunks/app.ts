import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppService } from '../../services/app';
import { getBaseUrl } from '../selectors/features/app';

/**
 * Just an example below that how we will create asynchronous actions
 * Mostly these actions used to make an Api call and returns response to the reducers
 * to update the data in the reducers
 */

const appService = new AppService();

export const fetchAppData = createAsyncThunk<TObject, TObject, IActionOptions>(
  'app/fetchAppData',
  async (_requestPayload: Record<string, string>, thunkAPI) => {
  // Example of an API call to fetch the app-data
    const baseUrl = getBaseUrl(thunkAPI.getState());
    const response = await appService.fetchAppData(baseUrl);

    // const response = { data: null, error: { message: 'API failed with status 400' }}; // example response
    if (response.error) {
      return thunkAPI.rejectWithValue({ ...response.error });
    }

    return response?.data;
  }
);
