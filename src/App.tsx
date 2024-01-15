import './App.css';
import {Outlet} from 'react-router-dom';
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from '@/components/ui/resizable.tsx';
import Sidebar from '@/components/common/Sidebar.tsx';
import {ScrollArea} from '@/components/ui/scroll-area';

function App() {
    return (
        <div className="vh-full">
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel minSize={25} maxSize={50} defaultSize={30}>
                    <Sidebar/>
                </ResizablePanel>
                <ResizableHandle/>
                <ResizablePanel className="overflow-auto bg-gray-100 dark:bg-gray-900">
                    <ScrollArea className="max-h-full overflow-auto">
                        <Outlet/>
                    </ScrollArea>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}

export default App;
