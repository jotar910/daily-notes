import reactLogo from './assets/react.svg';
import './App.css';
import { Button } from '@/components/ui/button.tsx';

function App() {
    return (
        <div className="container p-4">
            <h1 className="h2 muted inline">Welcome to Tauri!</h1>
            <img src={reactLogo} className="logo react inline ml-2 mb-2" alt="React logo" />
            <Button variant="ghost" className="float-right">Click me!</Button>
            <p className="p">This is a template for React + Tauri + TailwindCSS + shadcn/ui</p>
        </div>
    );
}

export default App;
