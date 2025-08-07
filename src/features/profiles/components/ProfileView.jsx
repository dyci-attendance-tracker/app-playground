import { useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { useProfiles } from '../../../contexts/ProfilesContext';
import { BoxIcon } from 'lucide-react';
import { Typography } from '@material-tailwind/react';
import { useWorkspace } from '../../../contexts/WorkspaceContext';

function ProfileView() {
  const { currentPage, itemsPerPage } = useOutletContext();
  const { profileID } = useParams();
  const { profiles, fetchProfiles, isLoading } = useProfiles();
  const {workspaceID} = useParams()

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfiles(workspaceID);
  }, []);

  useEffect(() => {
    const found = profiles.find(p => p.id === profileID);
    if (found) {
      setProfile(found);
    }
  }, [profiles, profileID]);

  if (isLoading || !profile) {
    return (
      <div className="flex-1 primary flex items-center justify-center text-color-secondary text-sm">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col justify-between relative rounded-lg transition-all duration-300">
        {/* Profile Summary Section */}
        <div className="flex-1 primary lg:p-4 p-3 flex flex-col gap-4">
            <div className='flex items-center gap-3'>
            <BoxIcon size={24} className="text-gray-500" />
            <div className="flex-1 text-left w-full pr-3">
                <Typography className="text-lg font-semibold text-color break-words whitespace-pre-wrap">
                {profile.lastName}, {profile.firstName} {profile.middleName && `${profile.middleName}`}
                </Typography>
                <Typography className="text-xs text-color-secondary">
                ID Number: {profile.IDNumber}
                </Typography>
            </div>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col gap-2 lg:pl-2 pl-3">
            <span className="flex flex-col gap-0 items-start w-full">
                <Typography className="text-xs text-color-secondary">Email</Typography>
                <Typography className="text-sm text-color">{profile.email}</Typography>
            </span>
            <span className="flex flex-col gap-0 items-start w-full">
                <Typography className="text-xs text-color-secondary">Phone</Typography>
                <Typography className="text-sm text-color">{profile.phone}</Typography>
            </span>
            </div>

            {/* Academic Info */}
            <div className="grid grid-cols-2 gap-4 lg:pl-2 pl-3 mt-1">
            <div className="flex flex-col gap-0 items-start w-full">
                <Typography className="text-xs text-color-secondary">College Department</Typography>
                <Typography className="text-sm text-color">{profile.collegeDepartment || 'N/A'}</Typography>
            </div>
            <div className="flex flex-col gap-0 items-start w-full">
                <Typography className="text-xs text-color-secondary">Course</Typography>
                <Typography className="text-sm text-color">{profile.course || 'N/A'}</Typography>
            </div>
            <div className="flex flex-col gap-0 items-start w-full">
                <Typography className="text-xs text-color-secondary">Year Level</Typography>
                <Typography className="text-sm text-color">{profile.yearLevel || 'N/A'}</Typography>
            </div>
            <div className="flex flex-col gap-0 items-start w-full">
                <Typography className="text-xs text-color-secondary">Section</Typography>
                <Typography className="text-sm text-color">{profile.section || 'N/A'}</Typography>
            </div>
            </div>
        </div>

        {/* Optional future section: logs, attendance, etc. */}
        <div className="min-w-[300px] min-h-[30vh] p-2 flex flex-col gap-4 hide-scrollbar">
            {/* Placeholder or tabs/logs can go here */}
            <Typography className="text-xs text-color-secondary italic">No logs or actions yet.</Typography>
        </div>
    </div>
  );
}

export default ProfileView;
