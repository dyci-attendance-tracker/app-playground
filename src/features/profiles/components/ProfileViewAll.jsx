import { useEffect, useRef } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { useWorkspace } from '../../../contexts/WorkspaceContext';
import { BoxIcon, User2Icon, UserIcon } from 'lucide-react';
import { useProfiles } from '../../../contexts/ProfilesContext';
import ProfileActionMenu from '../../../components/common/ProfileActionMenu';

function ProfileViewAll() {
  const { currentPage, itemsPerPage, filteredProfiles } = useOutletContext();
  const { profiles, fetchProfiles, isLoading } = useProfiles();
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const {workspaceID} = useParams()

  useEffect(() => {
    fetchProfiles(workspaceID); // assumes workspace-aware fetching inside
  }, [workspaceID]);

  const paginatedProfiles = filteredProfiles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div ref={containerRef} className="h-full flex relative rounded-lg transition-all duration-300">
      <div className="flex-1 primary h-full overflow-y-auto">
        <div className="flex flex-col gap-4">
          <div className="w-full overflow-x-auto hide-scrollbar">
            <div className="min-w-[1000px]">
              {/* Table Header */}
              <div className="grid grid-cols-[20px_2.5fr_4fr_4fr_3fr_3.5fr_3.5fr_2.5fr] text-left gap-4 px-4 py-2 text-sm font-semibold text-color-secondary border-b border-gray-700">
                <span></span>
                <span>#</span>
                <span>Full Name</span>
                <span>Email</span>
                <span>Phone</span>
                <span>Department</span>
                <span>Course</span>
                <span>Year & Section</span>
              </div>

              {/* Table Body */}
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-sm text-color-secondary mt-10">Loading profiles...</div>
                </div>
              ) : profiles.length === 0 ? (
                <div className="text-sm text-color-secondary p-4">No profiles found.</div>
              ) : (
                <div className="divide-y divide-gray-800 min-w-[1000px]">
                  {paginatedProfiles.map((profile) => (
                    <div
                      key={profile.id}
                      className="grid grid-cols-[20px_2.5fr_4fr_4fr_3fr_3.5fr_3.5fr_2.5fr] gap-4 px-4 py-3 text-left text-sm hover:bg-gray-800 transition-all cursor-pointer group"
                      onClick={() => navigate(`/${workspaceID}/profiles/${profile.id}`)}
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
