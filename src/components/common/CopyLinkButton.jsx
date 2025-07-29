import { Button, Chip, Tooltip, Typography } from '@material-tailwind/react';
import { ArrowBigUpDash, Link } from 'lucide-react'; // assuming you're using lucide icons
import { toast } from 'sonner'; // optional: for user feedback

function CopyLinkButton() {
  const handleCopy = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
      .then(() => {
        toast.success("Link copied to clipboard!");
      })
      .catch(err => {
        console.error("Failed to copy:", err);
        toast.error("Failed to copy link.");
      });
  };

  return (
    <Tooltip
        className="primary border border-gray-700 text-xs text-color "
        animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0, y: -25 },
            direction: 'top'
        }}
        content={
        <div className="flex items-center gap-3">
          <Typography color="blue-gray" className="font-medium">
            Copy View URL
          </Typography>
          <div className='flex items-center'>
            <Chip variant='ghost' value="Ctrl" color="green" size="sm" className="border border-gray-700 w-fit" />
            <Chip variant='ghost' value={<ArrowBigUpDash size={16} className='w-fit p-0' />} color="green" size="sm" className="border border-gray-700 w-fit" />
            <Chip variant='ghost' value="C" color="green" size="sm" className="border border-gray-700 w-fit" />
          </div>
        </div>
      }
    >
        <Button
          onClick={handleCopy}
          className="p-1 bg-transparent text-color text-xs font-semibold cursor-pointer hover:bg-gray-600"
        >
          <Link size={16} className="text-color-secondary" />
        </Button>
    </Tooltip>
  );
}


export default CopyLinkButton
