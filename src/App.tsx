import DateAdapter from '@mui/lab/AdapterDateFns';
import { LocalizationProvider } from '@mui/lab';
import { CssBaseline } from '@mui/material';
import { FeeCalculator } from './components/FeeCalculator';

const App = () => {
  return (
    <LocalizationProvider dateAdapter={DateAdapter}>
      <CssBaseline>
          <FeeCalculator />
      </CssBaseline >
    </LocalizationProvider >
  )
}

export default App;
