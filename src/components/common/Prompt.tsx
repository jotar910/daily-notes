import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button.tsx';

interface PromptProps {
    open?: boolean;
    title: string;
    message: string;
    onOk: (...args: any[]) => void;
    onCancel: (...args: any[]) => void;
}

function Prompt({ open = true, title, message, onOk, onCancel }: PromptProps) {
    return (
        <Dialog defaultOpen={open}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{message}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button onClick={onCancel} variant="destructive">No</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button onClick={onOk} variant="ghost">Yes</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default Prompt;
