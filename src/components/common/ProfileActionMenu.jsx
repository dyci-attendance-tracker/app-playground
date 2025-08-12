import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
  Typography,
} from '@material-tailwind/react';
import { SlidersHorizontal, Pencil, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProfiles } from '../../contexts/ProfilesContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { toast } from 'sonner';
import EditProfile from '../../features/profiles/EditProfile';


export default function ProfileActionMenu({ selectedProfile }) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const { deleteProfile } = useProfiles();
  const {workspaceID} = useParams()
  const navigate = useNavigate();

  const onDelete = async () => {
    try {
      await deleteProfile(workspaceID, selectedProfile.id);
      toast.success('Profile deleted successfully!');
    } catch (err) {
      console.error('Delete failed', err);
      toast.error('Failed to delete profile.');
    } finally {
      setOpenDeleteDialog(false);
      navigate(`/${workspaceID}/profiles/all`);
    }
  };

  return (
    <>
      <EditProfile
        open={openModal}
        onClose={(e) => { setOpenModal(false)}}
        profile={selectedProfile}
        onSave={(e) => { setOpenModal(false)}}
      />

      <Menu placement="bottom-end">
        <MenuHandler>
          <Button
            variant="text"
            size="sm"
            className="flex items-center text-sm font-semibold justify-between px-4 py-1 hover:bg-gray-700 gap-2 text-color rounded-lg"
          >
            <SlidersHorizontal size={16} className="text-color-secondary" />
            <Typography className="text-sm lg:text-xs font-semibold text-color">
              Actions
            </Typography>
          </Button>
        </MenuHandler>

        <MenuList className="overlay text-color-secondary backdrop-blur-md p-1 max-w-[200px] border-gray-700">
          <MenuItem
            onClick={(e) => { setOpenModal(true)}}
            className="text-color flex items-center gap-2 text-sm py-1.5 px-2 hover:bg-gray-700"
          >
            <Pencil size={16} className="text-color-secondary" />
            Edit
          </MenuItem>

          <div className="h-px my-1 bg-gray-700" />

          <MenuItem
            onClick={(e) => { setOpenDeleteDialog(true)}}
            className="text-red-400 flex items-center gap-2 text-sm py-1.5 px-2 hover:bg-gray-700"
          >
            <Trash2 size={16} className="text-red-400" />
            Delete
          </MenuItem>
        </MenuList>
      </Menu>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {openDeleteDialog && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => { setOpenDeleteDialog(false)}}
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
                <h3 className="text-base font-semibold">Confirm Delete</h3>
                <button
                  onClick={(e) => { setOpenDeleteDialog(false)}}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={20} className="hover:bg-gray-700 rounded" />
                </button>
              </div>

              <p className="text-sm text-gray-300">
                Are you sure you want to delete the profile of{' '}
                <strong>
                  {selectedProfile?.firstName} {selectedProfile?.lastName}
                </strong>
                ? This action cannot be undone.
              </p>

              <div className="mt-6 flex justify-end gap-2 border-t border-gray-700 pt-4">
                <button
                  onClick={(e) => { setOpenDeleteDialog(false)}}
                  className="px-4 py-1.5 text-sm font-medium text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={(e) => { onDelete()}}
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
