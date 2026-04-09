import { ThemeProvider } from './context/ThemeContext';
import CalendarCard from './components/CalendarCard';

function App() {
  return (
    <ThemeProvider>
      <div className="w-full min-h-screen transition-colors duration-500">
        <CalendarCard />
      </div>
    </ThemeProvider>
  );
}

export default App;
