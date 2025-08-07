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
import { useParticipants } from '../../contexts/ParticipantsContext';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import EditEvent from '../../features/events/EditEvent';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import QRCode from "react-qr-code";


export default function EventActionsMenu({ selectedEvent }) {

    const { deleteEvent, duplicateEvent } = useEvents();
    const { clearList, resetList } = useParticipants();

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openClearDialog, setOpenClearDialog] = useState(false);
    const [openResetDialog, setOpenResetDialog] = useState(false);
    const [openRegistrationDialog, setOpenRegistrationDialog] = useState(false);
    const [openCheckInDialog, setOpenCheckInDialog] = useState(false);

    const [openModal, setOpenModal] = useState(false);

    const { currentWorkspace } = useWorkspace();

    const navigate = useNavigate();

    const [ loading, setLoading ] = useState(false);

    const registrationLink = `${window.location.origin}/public/${currentWorkspace.id}/${selectedEvent.id}/register`;
    const checkInLink = `${window.location.origin}/public/${currentWorkspace.id}/${selectedEvent.id}/check-in`;


    const copyToClipboard = async () => {
    await navigator.clipboard.writeText(registrationLink);
    toast.success("Link copied to clipboard!");
    };

    const onDuplicate = async () => {
    try {
        setLoading(true);
        await duplicateEvent(selectedEvent);
        toast.success("Event duplicated successfully!");
    } catch (err) {
        console.error("Duplication failed", err);
        toast.error("Failed to duplicate event.");
    } finally{
        setLoading(false);
    }
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            await deleteEvent(selectedEvent.id);
            toast.success("Event deleted successfully!");
        } catch (err) {
            console.error("Delete failed", err);
            toast.error("Failed to delete event.");
        } finally {
            setTimeout(() => {
                setLoading(false);
                setOpenDeleteDialog(false);
                navigate(`/${currentWorkspace.url}/events/all`);
            }, [800])
        }
    };

    const onClearList = async () => {
        try {
            setLoading(true)
            await clearList(currentWorkspace.id,selectedEvent.id);
            toast.success("List cleared successfully!")
        } catch (err) {
            console.error("Clear List failed", err);
            toast.error("Failed to clear list.");
        } finally {
            setTimeout(() => {
                setLoading(false)
                setOpenClearDialog(false);
            },[800])
        }
    }

    const onResetList = async () => {
        try {
            setLoading(true);
            await resetList(currentWorkspace.id,selectedEvent.id);
            toast.success("List reset successfully!")
        } catch (err) {
            console.error("Clear Reset failed", err);
            toast.error("Failed to reset list.");
        } finally {
            setTimeout(() => {
                setLoading(false);
                setOpenResetDialog(false);
            },[800])
        }
    }

    const onDownload = () => {}

    const onShareCheckInLink = () => {
        setOpenRegistrationDialog(true);
    }

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
                onClick = {() => { setOpenModal(true)}}
                className="text-color flex items-center gap-2 text-sm py-1.5 px-2 hover:bg-gray-700"
                >
                <Pencil size={16} className="text-color-secondary" />
                Edit
            </MenuItem>
            <MenuItem
            onClick = {() => { onDuplicate()}}
            className="text-color flex items-center gap-2 text-sm py-1.5 px-2 hover:bg-gray-700"
            >
            <Copy size={16} className="text-color-secondary" />
            Duplicate
            </MenuItem>
            <div className="h-px my-1 bg-gray-700" />
            <MenuItem
            onClick = {() => { setOpenDeleteDialog(true)}}
            className="text-red-400 flex items-center gap-2 text-sm py-1.5 px-2 hover:bg-gray-700"
            >
            <Trash2 size={16} className="text-red-400" />
            Delete
            </MenuItem>
            <div className="h-px my-1 bg-gray-700" />
            <MenuItem
            onClick = {() => { setOpenClearDialog(true)}}
            className="text-color flex items-center gap-2 text-sm py-1.5 px-2 hover:bg-gray-700"
            >
            <RefreshCw size={16} className="text-color-secondary" />
            Clear List
            </MenuItem>
            <MenuItem
            onClick = {() => { setOpenResetDialog(true)}}
            className="text-color flex items-center gap-2 text-sm py-1.5 px-2 hover:bg-gray-700"
            >
            <StepBack size={16} className="text-color-secondary" />
            Reset List
            </MenuItem>
            <div className="h-px my-1 bg-gray-700" />
            <MenuItem
            onClick = {() => { onDownload()}}
            className="text-color flex items-center gap-2 text-sm py-1.5 px-2 hover:bg-gray-700"
            >
            <Download size={16} className="text-color-secondary" />
            Download
            </MenuItem>
            <div className="h-px my-1 bg-gray-700" />
            <MenuItem
            onClick = {() => { setOpenCheckInDialog(true)}}
            className="text-color flex items-center gap-2 text-sm py-1.5 px-2 hover:bg-gray-700"
            >
            <Link size={16} className="text-color-secondary" />
            Share Check-In Link
            </MenuItem>
            <MenuItem
            onClick = {() => {setOpenRegistrationDialog(true)}}
            className="text-color flex items-center gap-2 text-sm py-1.5 px-2 hover:bg-gray-700"
            >
            <Link size={16} className="text-color-secondary" />
            Share Registration Link
            </MenuItem>
        </MenuList>
        </Menu>

        {/* These are the dialogs and we can actually seperate these into thter own components later for better readability */}
        {/* On Delete */}
        <AnimatePresence>
            {openDeleteDialog && (
                <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick = {() => { setOpenDeleteDialog(false)}}
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
                    onClick = {(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base font-semibold">Confirm Delete</h3>
                    <button
                        onClick = {(e) => {e.stopPropagation();  setOpenDeleteDialog(false)}}
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
                        onClick = {() => { setOpenDeleteDialog(false)}}
                        className="px-4 py-1.5 text-sm font-medium text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick = {(e) => {e.stopPropagation(); onDelete()}}
                        className="px-4 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded"
                        disabled={loading}
                    >
                        {loading ? "Deleting" : "Confirm"}
                    </button>
                    </div>
                </motion.div>
                </motion.div>
            )}
            </AnimatePresence>

            {/* OnClear */}
            <AnimatePresence>
            {openClearDialog && (
                <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick = {() => { setOpenClearDialog(false)}}
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
                    onClick = {(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base font-semibold">Confirm Clear</h3>
                    <button
                        onClick = {() => { setOpenClearDialog(false)}}
                        className="text-gray-400 hover:text-white"
                    >
                        <X size={20} className="hover:bg-gray-700 rounded" />
                    </button>
                    </div>

                    {/* Body */}
                    <p className="text-sm text-gray-300">
                    Are you sure you want to clear the event{" "}
                    <strong>{selectedEvent?.name}</strong>? This action cannot be undone.
                    </p>

                    {/* Footer */}
                    <div className="mt-6 flex justify-end gap-2 border-t border-gray-700 pt-4">
                    <button
                        onClick = {() => { setOpenClearDialog(false)}}
                        className="px-4 py-1.5 text-sm font-medium text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick = {() => { onClearList()}}
                        className="px-4 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded"
                        disabled={loading}
                    >
                        {loading ? "Clearing" : "Confirm"}
                    </button>
                    </div>
                </motion.div>
                </motion.div>
            )}
            </AnimatePresence>

            {/* OnReset */}
            <AnimatePresence>
            {openResetDialog && (
                <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick = {() => { setOpenResetDialog(false)}}
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
                    onClick = {(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base font-semibold">Confirm Reset</h3>
                    <button
                        onClick = {() => { setOpenResetDialog(false)}}
                        className="text-gray-400 hover:text-white"
                    >
                        <X size={20} className="hover:bg-gray-700 rounded" />
                    </button>
                    </div>

                    {/* Body */}
                    <p className="text-sm text-gray-300">
                    Are you sure you want to reset the statuses of the participants of this event{" "}
                    <strong>{selectedEvent?.name}</strong>? This action cannot be undone.
                    </p>

                    {/* Footer */}
                    <div className="mt-6 flex justify-end gap-2 border-t border-gray-700 pt-4">
                    <button
                        onClick = {() => { setOpenResetDialog(false)}}
                        className="px-4 py-1.5 text-sm font-medium text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick = {() => { onResetList()}}
                        className="px-4 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded"
                        disabled={loading}
                    >
                        {loading ? "Resetting" : "Confirm"}
                    </button>
                    </div>
                </motion.div>
                </motion.div>
            )}
            </AnimatePresence>


            {/* Share Link - Registration */}
            <AnimatePresence>
            {openRegistrationDialog && (
                <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpenRegistrationDialog(false)}
                >
                <motion.div
                    className="overlay w-full max-w-md rounded-lg border border-gray-700 bg-gray-900 p-6 text-color"
                    initial={{ scale: 0.95, y: 20, opacity: 0 }}
                    animate={{
                    scale: 1,
                    y: 0,
                    opacity: 1,
                    transition: { type: "spring", stiffness: 300, damping: 20 },
                    }}
                    exit={{
                    scale: 0.9,
                    opacity: 0,
                    transition: { duration: 0.15 },
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base font-semibold">Share Registration Link</h3>
                    <button
                        onClick={() => setOpenRegistrationDialog(false)}
                        className="text-gray-400 hover:text-white"
                    >
                        <X size={20} className="hover:bg-gray-700 rounded" />
                    </button>
                    </div>

                    {/* Body */}
                    <div className="space-y-4">
                    <div className="flex items-center justify-between bg-gray-800 px-3 py-2 rounded">
                        <Typography className="text-sm truncate text-gray-300">
                        {registrationLink}
                        </Typography>
                        <button onClick={copyToClipboard} className="text-sm px-2 py-1 text-gray-300 hover:text-white">
                        <Copy size={16} />
                        </button>
                    </div>
                    <div className="flex justify-center">
                        <QRCode
                            value={registrationLink}
                            size={160}
                            bgColor="#1f2937"  // Tailwind gray-800
                            fgColor="#ffffff"  // white foreground
                            className="rounded-md"
                        />
                    </div>
                        <Typography className="text-xs text-gray-400 leading-snug">
                            Share this registration link or QR code with participants so they can sign up for the event.
                            You can post this in group chats, announcement boards, or print the QR code for on-site scanning.
                        </Typography>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 flex justify-end border-t border-gray-700 pt-4">
                    <button
                        onClick={() => setOpenRegistrationDialog(false)}
                        className="px-4 py-1.5 text-sm font-medium text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded"
                    >
                        Close
                    </button>
                    </div>
                </motion.div>
                </motion.div>
            )}
            </AnimatePresence>


            {/* Share Check-in Link */}
            <AnimatePresence>
            {openCheckInDialog && (
                <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpenCheckInDialog(false)}
                >
                <motion.div
                    className="overlay w-full max-w-md rounded-lg border border-gray-700 bg-gray-900 p-6 text-color"
                    initial={{ scale: 0.95, y: 20, opacity: 0 }}
                    animate={{
                    scale: 1,
                    y: 0,
                    opacity: 1,
                    transition: { type: "spring", stiffness: 300, damping: 20 },
                    }}
                    exit={{
                    scale: 0.9,
                    opacity: 0,
                    transition: { duration: 0.15 },
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base font-semibold">Share Check-in Link</h3>
                    <button
                        onClick={() => setOpenCheckInDialog(false)}
                        className="text-gray-400 hover:text-white"
                    >
                        <X size={20} className="hover:bg-gray-700 rounded" />
                    </button>
                    </div>

                    {/* Body */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between bg-gray-800 px-3 py-2 rounded">
                            <Typography className="text-sm truncate text-gray-300">
                            {checkInLink}
                            </Typography>
                            <button
                            onClick={() => {
                                navigator.clipboard.writeText(checkInLink);
                                toast.success("Check-in link copied!");
                            }}
                            className="text-sm px-2 py-1 text-gray-300 hover:text-white"
                            >
                            <Copy size={16} />
                            </button>
                        </div>

                        <div className="flex justify-center">
                            <QRCode
                            value={checkInLink}
                            size={160}
                            bgColor="#1f2937"
                            fgColor="#ffffff"
                            className="rounded-md"
                            />
                        </div>

                        <Typography className="text-xs text-gray-400 leading-snug">
                            This QR code lets participants check themselves in. Post it near event entrances
                            or on slides for easy scanning. Students must scan their ID for validation.
                        </Typography>
                        </div>

                        {/* Footer */}
                        <div className="mt-6 flex justify-end border-t border-gray-700 pt-4">
                        <button
                            onClick={() => setOpenCheckInDialog(false)}
                            className="px-4 py-1.5 text-sm font-medium text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded"
                        >
                            Close
                        </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
            </AnimatePresence>


        </>
    );
}
