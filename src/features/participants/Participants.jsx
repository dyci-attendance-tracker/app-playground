import React, { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { User, User2, User2Icon } from 'lucide-react';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { useParticipants } from '../../contexts/ParticipantsContext';
import { Chip, Typography } from '@material-tailwind/react';
import ProfileActionMenu from '../../components/common/ProfileActionMenu';
import ParticipantActionMenu from '../../components/common/ParticipantActionMenu';

const ITEMS_PER_PAGE = 10;

const STATUS_COLORS = {
  'attended': 'bg-green-600',
  'no-show': 'bg-red-600',
  'registered': 'bg-blue-600',
  // Add more statuses if needed
};

function Participants({ currentPage, itemsPerPage, filteredParticipants }) {
  const { eventID } = useParams();
  const { currentWorkspace } = useWorkspace();
  const { participants, fetchParticipants, isLoading } = useParticipants();
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (eventID && currentWorkspace?.id) {
      fetchParticipants(currentWorkspace?.id, eventID);
    }
  }, [eventID, currentWorkspace]);

  const paginatedParticipants = filteredParticipants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div ref={containerRef} className="h-full flex relative rounded-lg transition-all duration-300">
      <div className="flex-1 primary h-full">
        <div className="flex flex-col gap-4">
            <div className="">
              {/* Table Header */}
              <div className="min-w-[1000px]">
              <div className="grid grid-cols-[20px_2.5fr_4fr_4fr_3fr_3.5fr_3.5fr_2.5fr_3fr_100px] text-left gap-4 px-4 py-2 text-xs font-semibold text-color-secondary border-b border-gray-700">
                <span></span>
                <span>#</span>
                <span>Full Name</span>
                <span>Email</span>
                <span>Phone</span>
                <span>Department</span>
                <span>Course</span>
                <span>Year & Section</span>
                <span>Status</span>
                <span className="text-center pr-4">Options</span>
              </div>
              </div>

              {/* Table Body */}
              {isLoading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="text-sm text-color-secondary">Loading participants...</div>
                </div>
              ) : participants.length === 0 ? (
                <div className="text-sm text-color-secondary p-4">No participants found.</div>
              ) : (
                <>
                    <div className="overflow-x-auto hide-scrollbar">
                        <div className="divide-y divide-gray-800 min-w-[1000px] max-h-[300px] overflow-y-auto hide-scrollbar">
                            {paginatedParticipants.map((profile) => (
                            <div
                                key={profile.id}
                                className="grid grid-cols-[20px_2.5fr_4fr_4fr_3fr_3.5fr_3.5fr_2.5fr_3fr_100px] gap-4 px-4 py-3 text-left text-sm hover:bg-gray-800 transition-all cursor-pointer group"
                                onClick={() => navigate(`/${currentWorkspace.url}/profiles/${profile.id}`)}
                            >
                                <div><User2Icon size={18} className="text-gray-500" /></div>
                                <div className="w-fit text-color-secondary">{profile.IDNumber}</div>
                                <div className="truncate text-color">
                                {profile.lastName}, {profile.firstName} {profile.middleName || ''}
                                </div>
                                <div className="truncate text-color-secondary">{profile.email}</div>
                                <div className="truncate text-color-secondary">{profile.phone}</div>
                                <div className="truncate text-color-secondary">{profile.collegeDepartment}</div>
                                <div className="truncate text-color-secondary">{profile.course}</div>
                                <div className="text-color-secondary">{profile.yearLevel} - {profile.section}</div>
                                <Chip
                                  variant="ghost"
                                  value={profile.status}
                                  size="sm"
                                  className={`${STATUS_COLORS[profile.status] || 'gray'} border border-gray-700 w-fit`}
                                />
                                <div className="flex items-center justify-center gap-2 pr-4 w-fit">
                                <ParticipantActionMenu selectedParticipant={profile} />
                                </div>
                            </div>
                            ))}
                        </div>
                    </div>
                </>
              )}
            </div>
        </div>
      </div>
    </div>
  );
}

export default Participants;
