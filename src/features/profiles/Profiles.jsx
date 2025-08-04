import { useEffect, useState } from 'react';
import { Box, PanelRight, Plus, Upload } from 'lucide-react';
import { useSidebar } from '../../contexts/SidebarContext';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { Typography, Chip, Button } from '@material-tailwind/react';
import { Outlet } from 'react-router';
import CopyLinkButton from '../../components/common/CopyLinkButton';
import ProjectFilterButton from '../../components/common/ProjectFilterButton';
import { useProfiles } from '../../contexts/ProfilesContext';
import { navigatePage } from '../../utils/navigation';
import CreateProfile from './CreateProfile';
import ImportProfiles from './components/ImportProfiles';

function Profiles() {
  const { currentWorkspace } = useWorkspace();
  const { profiles } = useProfiles();

  const [openModal, setOpenModal] = useState(false);
  const [openImportModal, setOpenImportModal] = useState(false);
  const { setIsLeftSidebarOpen, setIsMobileOpen } = useSidebar();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalPages = Math.ceil(profiles.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
        <CreateProfile open={openModal} onClose={() => setOpenModal(false)} />
        <ImportProfiles open={openImportModal} onClose={() => setOpenImportModal(false)} />
        <main className="flex-1 h-full lg:border lg:border-gray-700 lg:rounded-lg primary">
            <div className="h-full flex flex-col">
            {/* Top Bar */}
            <div className="h-10 border-b border-gray-700 px-4 flex items-center justify-between sm:justify-end">
                <div className="flex gap-2 justify-between items-center w-full">
                <div className="flex items-center gap-3">
                    <button className="lg:hidden text-color-secondary hover:text-color" onClick={() => setIsMobileOpen(true)}>
                    <PanelRight size={16} />
                    </button>
                    <button className="hidden lg:block text-color-secondary hover:text-color" onClick={() => setIsLeftSidebarOpen(prev => !prev)}>
                    <PanelRight size={16} />
                    </button>
                    <Typography className="text-color text-xs font-semibold">Profiles</Typography>
                    <Chip
                    variant="ghost"
                    value={
                        <span className="flex items-center gap-1">
                        <Box size={16} className="text-color-secondary" />
                        <Typography className="text-color text-xs font-semibold">All Profiles</Typography>
                        </span>
                    }
                    className="bg-gray-700 text-color px-2 py-1 hidden sm:block rounded-md cursor-pointer hover:bg-gray-600"
                    onClick={() => navigatePage(`/${currentWorkspace.url}/profiles`)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <CopyLinkButton />

                    <Button className="flex bg-gray-700 gap-1 items-center px-2 py-1 text-color text-xs font-semibold hover:bg-gray-600" onClick={() => setOpenImportModal(true)}>
                        <Upload size={16} className="text-color-secondary" /> <Typography className="hidden sm:block text-xs">Import Profiles</Typography>
                    </Button>

                    <Button className="flex bg-gray-700 gap-1 items-center px-2 py-1 text-color text-xs font-semibold hover:bg-gray-600" onClick={() => setOpenModal(true)}>
                        <Plus size={16} className="text-color-secondary" /> <Typography className="hidden sm:block text-xs">Add Profile</Typography>
                    </Button>
                </div>
                </div>
            </div>

            {/* Filter Bar
            <div className="h-10 border-b border-gray-700 px-3 flex items-center justify-between">
                <ProjectFilterButton />
            </div> */}

            {/* Table Content */}
            <div className="flex-1 overflow-x-auto hide-scrollbar">
                <Outlet context={{ currentPage, itemsPerPage }} />
            </div>

            {/* Pagination */}
            <div className="flex w-full mt-auto justify-between items-center gap-2 py-4 lg:px-6 px-4 text-sm text-color-secondary border-t border-gray-700">
                <Typography className="text-color text-xs font-semibold">Page {currentPage} of {totalPages}</Typography>
                <div className="flex gap-4 items-center">
                <div className="flex gap-1 items-center">
                    <span className="text-xs text-color-secondary">Show</span>
                    <select
                    value={itemsPerPage}
                    onChange={(e) => {
                        setItemsPerPage(parseInt(e.target.value));
                        setCurrentPage(1);
                    }}
                    className="custom-select w-fit px-2 py-1 text-center text-color border border-gray-700 rounded-md bg-gray-900 focus:outline-none"
                    >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                    </select>
                    <span className="text-xs text-color-secondary">entries</span>
                </div>
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="bg-gray-700 text-color px-3 py-2 text-xs font-semibold rounded-md hover:bg-gray-600 disabled:opacity-50"
                >
                    Prev
                </button>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || currentPage > totalPages}
                    className="bg-gray-700 text-color px-3 py-2 text-xs font-semibold rounded-md hover:bg-gray-600 disabled:opacity-50"
                >
                    Next
                </button>
                </div>
            </div>
            </div>
        </main>
    </>
  );
}

export default Profiles;
