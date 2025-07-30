import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
  Typography,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from '@material-tailwind/react';
import {
  SlidersHorizontal,
  Pencil,
  Copy,
  Trash2,
  RefreshCw,
  StepBack,
  Link,
  Download,
  X,
} from 'lucide-react';
import { useEvents } from '../../contexts/EventContext';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import EditEvent from '../../features/events/EditEvent';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function ActionsMenu({ selectedEvent }) {

    const { deleteEvent, duplicateEvent } = useEvents();

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    const { currentWorkspace } = useWorkspace();

    const navigate = useNavigate();

    const onDuplicate = async () => {
    try {
        await duplicateEvent(selectedEvent);
        toast.success("Event duplicated successfully!");
    } catch (err) {
        console.error("Duplication failed", err);
        toast.error("Failed to duplicate event.");
    }
    };

    const onDelete = async () => {
        try {
            await deleteEvent(selectedEvent.id);
            toast.success("Event deleted successfully!");
        } catch (err) {
            console.error("Delete failed", err);
            toast.error("Failed to delete event.");
        } finally {
            setOpenDeleteDialog(false);
            navigate(`/${currentWorkspace.url}/events/all`);
        }
    };

    const onClearList = () => {}

    const onResetList = () => {}

    const onDownload = () => {}

    const onShareCheckInLink = () => {}

    const onShareRegistrationLink = () => {}


    return (
        <>
        <EditEvent open={openModal} onClose={() => setOpenModal(false)} event={selectedEvent} onSave={() => setOpenModal(false)} />
        <Menu placement="bottom-end">
        <MenuHandler>
            <Button
            variant="text"
            size="sm"
            className="flex items-center text-sm font-semibold justify-between px-4 py-1 hover:bg-gray-700 gap-2 text-color rounded-lg"
            >
            <SlidersHorizontal size={16} className="text-color-secondary" />
            <Typography className="overflow-hidden text-ellipsis whitespace-nowrap text-xs font-semibold text-color">
                Actions
            </Typography>
            </Button>
        </MenuHandler>

        <MenuList className="overlay text-color-secondary backdrop-blur-md w-full p-1 max-w-[200px] border-gray-700">
            <MenuItem
                onClick={() => setOpenModal(true)}
                className="text-color flex items-center gap-2 text-sm py-1.5 px-2 hover:bg-gray-700"
                >
                <Pencil size={16} className="text-color-secondary" />
                Edit
            </MenuItem>
            <MenuItem
            onClick={onDuplicate}
            className="text-color flex items-center gap-2 text-sm py-1.5 px-2 hover:bg-gray-700"
            >
            <Copy size={16} className="text-color-secondary" />
            Duplicate
            </MenuItem>
            <div className="h-px my-1 bg-gray-700" />
            <MenuItem
            onClick={() => setOpenDeleteDialog(true)}
            className="text-red-400 flex items-center gap-2 text-sm py-1.5 px-2 hover:bg-gray-700"
            >
            <Trash2 size={16} className="text-red-400" />
            Delete
            </MenuItem>
            <div className="h-px my-1 bg-gray-700" />
            <MenuItem
            onClick={onClearList}
            className="text-color flex items-center gap-2 text-sm py-1.5 px-2 hover:bg-gray-700"
            >
            <RefreshCw size={16} className="text-color-secondary" />
            Clear List
            </MenuItem>
            <MenuItem
            onClick={onResetList}
            className="text-color flex items-center gap-2 text-sm py-1.5 px-2 hover:bg-gray-700"
            >
            <StepBack size={16} className="text-color-secondary" />
            Reset List
            </MenuItem>
            <div className="h-px my-1 bg-gray-700" />
            <MenuItem
            onClick={onDownload}
            className="text-color flex items-center gap-2 text-sm py-1.5 px-2 hover:bg-gray-700"
            >
            <Download size={16} className="text-color-secondary" />
            Download
            </MenuItem>
            <div className="h-px my-1 bg-gray-700" />
            <MenuItem
            onClick={onShareCheckInLink}
            className="text-color flex items-center gap-2 text-sm py-1.5 px-2 hover:bg-gray-700"
            >
            <Link size={16} className="text-color-secondary" />
            Share Check-In Link
            </MenuItem>
            <MenuItem
            onClick={onShareRegistrationLink}
            className="text-color flex items-center gap-2 text-sm py-1.5 px-2 hover:bg-gray-700"
            >
            <Link size={16} className="text-color-secondary" />
            Share Registration Link
            </MenuItem>
        </MenuList>
        </Menu>
        <AnimatePresence>
            {openDeleteDialog && (
                <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpenDeleteDialog(false)}
                >
                <motion.div
                    className="overlay w-full max-w-md rounded-lg border border-gray-700 bg-gray-900 p-6 text-color"
                    initial={{ scale: 0.95, y: 20, opacity: 0 }}
                    animate={{
                    scale: 1,
                    y: 0,
                    opacity: 1,
                    transition: { type: "spring", stiffness: 300, damping: 20 }
                    }}
                    exit={{
                    scale: 0.9,
                    opacity: 0,
                    transition: { duration: 0.15 }
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base font-semibold">Confirm Delete</h3>
                    <button
                        onClick={() => setOpenDeleteDialog(false)}
                        className="text-gray-400 hover:text-white"
                    >
                        <X size={20} className="hover:bg-gray-700 rounded" />
                    </button>
                    </div>

                    {/* Body */}
                    <p className="text-sm text-gray-300">
                    Are you sure you want to delete the event{" "}
                    <strong>{selectedEvent?.name}</strong>? This action cannot be undone.
                    </p>

                    {/* Footer */}
                    <div className="mt-6 flex justify-end gap-2 border-t border-gray-700 pt-4">
                    <button
                        onClick={() => setOpenDeleteDialog(false)}
                        className="px-4 py-1.5 text-sm font-medium text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onDelete}
                        className="px-4 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded"
                    >
                        Confirm
                    </button>
                    </div>
                </motion.div>
                </motion.div>
            )}
            </AnimatePresence>

        </>
    );
}
