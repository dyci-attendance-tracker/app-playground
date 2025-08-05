import { useEffect, useRef } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useWorkspace } from '../../../contexts/WorkspaceContext';
import { BoxIcon, User2Icon, UserIcon } from 'lucide-react';
import ActionsMenu from '../../../components/common/ActionsMenu';
import { useProfiles } from '../../../contexts/ProfilesContext';
import ProfileActionMenu from '../../../components/common/ProfileActionMenu';

function ProfileViewAll() {
  const { currentPage, itemsPerPage, filteredProfiles } = useOutletContext();
  const { profiles, fetchProfiles, isLoading } = useProfiles();
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { currentWorkspace } = useWorkspace();

  useEffect(() => {
    fetchProfiles(); // assumes workspace-aware fetching inside
  }, [currentWorkspace]);

  const paginatedProfiles = filteredProfiles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div ref={containerRef} className="h-full flex relative rounded-lg transition-all duration-300">
      <div className="flex-1 primary h-full overflow-y-auto">
        <div className="flex flex-col gap-4">
          <div className="w-full overflow-x-auto hide-scrollbar">
            <div className="min-w-[850px]">
              {/* Table Header */}
              <div className="grid grid-cols-[20px_1fr_2fr_2fr_1fr_1.5fr_1.5fr_1.5fr_140px] text-left gap-4 px-4 py-2 text-xs font-semibold text-color-secondary border-b border-gray-700">
                <span></span>
                <span>#</span>
                <span>Full Name</span>
                <span>Email</span>
                <span>Phone</span>
                <span>Department</span>
                <span>Course</span>
                <span>Year & Section</span>
                <span className="text-center pr-4">Options</span>
              </div>

              {/* Table Body */}
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-sm text-color-secondary mt-10">Loading profiles...</div>
                </div>
              ) : profiles.length === 0 ? (
                <div className="text-sm text-color-secondary p-4">No profiles found.</div>
              ) : (
                <div className="divide-y divide-gray-800">
                  {paginatedProfiles.map((profile) => (
                    <div
                      key={profile.id}
                      className="grid grid-cols-[20px_1fr_2fr_2fr_1fr_1.5fr_1.5fr_1.5fr_140px] gap-4 px-4 py-3 text-left text-sm hover:bg-gray-800 transition-all cursor-pointer group"
                      onClick={() => navigate(`/${currentWorkspace.url}/profiles/${profile.id}`)}
                    >
                      <div><User2Icon size={18} className="text-gray-500" /></div>
                      <div className="text-color-secondary">{profile.IDNumber}</div>
                      <div className="truncate text-color">
                        {profile.lastName}, {profile.firstName} {profile.middleName || ''}
                      </div>
                      <div className="truncate text-color-secondary">{profile.email}</div>
                      <div className="truncate text-color-secondary">{profile.phone}</div>
                      <div className="truncate text-color-secondary">{profile.collegeDepartment}</div>
                      <div className="truncate text-color-secondary">{profile.course}</div>
                      <div className="text-color-secondary">{profile.yearLevel} - {profile.section}</div>
                      <div className="flex items-center justify-center gap-2 pr-4">
                        <ProfileActionMenu selectedProfile={profile} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileViewAll;
