import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
  Typography,
} from '@material-tailwind/react';
import {
  SlidersHorizontal,
  CircleCheckIcon,
  CircleXIcon,
  CircleDashed,
  Trash2,
  ChevronRightIcon,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';

// Replace with your actual context
import { useParticipants } from '../../contexts/ParticipantsContext';
import { useParams } from 'react-router';

export default function ParticipantActionMenu({ selectedParticipant }) {
  const {workspaceID} = useParams()
  const [openStatusMenu, setOpenStatusMenu] = useState(false);
  const [openRemoveDialog, setOpenRemoveDialog] = useState(false);
  const { updateParticipantStatus, removeParticipant, fetchParticipants} = useParticipants();
  const { eventID } = useParams();

  const handleStatusChange = async (status) => {
    try {
      await updateParticipantStatus(workspaceID,eventID,selectedParticipant.id, status);
      toast.success(`Status updated to ${status}`);
      fetchParticipants(workspaceID, eventID);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status.');
    }
  };

  const handleRemove = async () => {
    try {
      await removeParticipant(workspaceID, eventID, selectedParticipant.id);
      toast.success('Participant removed successfully.');
      fetchParticipants(workspaceID, eventID);
    } catch (err) {
      console.error(err);
      toast.error('Failed to remove participant.');
    } finally {
      setOpenRemoveDialog(false);
    }
  };

  return (
    <>
      <Menu placement="bottom-end">
        <MenuHandler>
          <Button
            variant="text"
            size="sm"
            className="flex items-center text-sm font-semibold justify-between px-4 py-1 hover:bg-gray-700 gap-2 text-color rounded-lg"
          >
            <SlidersHorizontal size={16} className="text-color-secondary" />
            <Typography className="text-xs font-semibold text-color">
              Actions
            </Typography>
          </Button>
        </MenuHandler>

        <MenuList className="overlay text-color-secondary backdrop-blur-md p-1 max-w-[220px] border-gray-700">
          {/* Change Status Submenu */}
          <Menu
            placement="right-start"
            open={openStatusMenu}
            handler={setOpenStatusMenu}
            allowHover
            offset={10}
          >
            <MenuHandler className='flex items-center justify-between py-1.5 text-sm text-color hover:bg-gray-700 w-full rounded-lg'>
              <MenuItem>
                <div className='flex items-center gap-2'>
                    <span>Change Status</span>
                    <ChevronRightIcon
                      size={16}
                      className=" text-color-secondary"
                    />
                </div>
              </MenuItem>
            </MenuHandler>

            <MenuList className="overlay text-color-secondary backdrop-blur-md p-2 max-w-[200px] border-gray-700">
              <MenuItem
                onClick={(e) => {e.stopPropagation();handleStatusChange('attended')}}
                className="text-color flex items-center gap-2 text-sm py-1.5 px-2 hover:bg-gray-700"
              >
                <CircleCheckIcon size={16} className="text-green-600" />
                Attended
              </MenuItem>
              <MenuItem
                onClick={(e) => {e.stopPropagation();handleStatusChange('registered')}}
                className="text-color flex items-center gap-2 text-sm py-1.5 px-2 hover:bg-gray-700"
              >
                <CircleDashed size={16} className="text-color-secondary" />
                Registered
              </MenuItem>
              <MenuItem
                onClick={(e) => {e.stopPropagation();handleStatusChange('no-show')}}
                className="text-color flex items-center gap-2 text-sm py-1.5 px-2 hover:bg-gray-700"
              >
                <CircleXIcon size={16} className="text-red-400" />
                No Show
              </MenuItem>
            </MenuList>
          </Menu>

          <div className="h-px my-1 bg-gray-700" />

          {/* Remove From List */}
          <MenuItem
            onClick={(e ) => {e.stopPropagation(); setOpenRemoveDialog(true)}}
            className="text-red-400 flex items-center gap-2 text-sm py-1.5 px-2 hover:bg-gray-700"
          >
            <Trash2 size={16} className="text-red-400" />
            Remove from List
          </MenuItem>
        </MenuList>
      </Menu>

      {/* Confirm Remove Dialog */}
      <AnimatePresence>
        {openRemoveDialog && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {e.stopPropagation();setOpenRemoveDialog(false)}}
          >
            <motion.div
              className="overlay w-full max-w-md rounded-lg border border-gray-700 bg-gray-900 p-6 text-color"
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{
                scale: 1,
                y: 0,
                opacity: 1,
                transition: { type: 'spring', stiffness: 300, damping: 20 },
              }}
              exit={{
                scale: 0.9,
                opacity: 0,
                transition: { duration: 0.15 },
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-semibold">Confirm Removal</h3>
                <button
                  onClick={(e) => {e.stopPropagation();setOpenRemoveDialog(false)}}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={20} className="hover:bg-gray-700 rounded" />
                </button>
              </div>

              <p className="text-sm text-gray-300">
                Are you sure you want to remove{' '}
                <strong>
                  {selectedParticipant?.firstName} {selectedParticipant?.lastName}
                </strong>{' '}
                from the participant list? This action cannot be undone.
              </p>

              <div className="mt-6 flex justify-end gap-2 border-t border-gray-700 pt-4">
                <button
                  onClick={(e) => {e.stopPropagation();setOpenRemoveDialog(false)}}
                  className="px-4 py-1.5 text-sm font-medium text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={(e) => {e.stopPropagation();handleRemove()}}
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
