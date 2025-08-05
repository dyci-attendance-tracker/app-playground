import React, { useEffect, useState } from "react";
import { X, FileSpreadsheet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useProfiles } from "../../../contexts/ProfilesContext";
import excelImportExample from '../../../assets/images/excel-import-example.png';

function ImportProfiles({ open, onClose }) {
  const { importProfilesFromExcel } = useProfiles();
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open]);

  const handleImport = async () => {
    if (!file) {
      toast.error("Please select a file first.");
      return;
    }

    setIsLoading(true);
    try {
      await importProfilesFromExcel(file);
      toast.success("Profiles imported successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to import profiles.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {e.stopPropagation(); onClose()}}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.95, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="overlay w-full max-w-2xl rounded-lg border border-gray-700 bg-gray-900 text-color p-6"
          >
            {/* Header */}
            <div className="flex justify-between items-center py-4 border-gray-700">
              <h2 className="text-xs font-semibold">Import Profiles</h2>
              <motion.button
                onClick={(e) => {e.stopPropagation(); onClose()}}
                className="text-gray-400 hover:text-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} className="hover:bg-gray-700 rounded" />
              </motion.button>
            </div>

            {/* Body */}
            <div className="space-y-3 flex-1">
              {/* Icon */}
              <div className="p-1 bg-gray-700 rounded w-fit">
                <FileSpreadsheet size={20} className="text-green-500" />
              </div>

              {/* Instructions */}
              <div className="text-sm text-gray-400 w-full flex flex-col justify-center">
                <p className="mb-2">
                  Upload an Excel (.xlsx) file with the following column headers:
                </p>
                <div className="flex w-full justify-center">
                    <ul className="list-disc list-inside text-xs w-70 lg:w-90">
                    <li className="flex justify-between">
                        <span>Student Number</span>
                        <span>First Name</span>
                    </li>
                    <li className="flex justify-between">
                        <span>Last Name</span>
                        <span>Middle Name</span>
                    </li>
                    <li className="flex justify-between">
                        <span>Email</span>
                        <span>Phone</span>
                    </li>
                    <li className="flex justify-between">
                        <span>College Department</span>
                        <span>Course</span>
                    </li>
                    <li className="flex justify-between">
                        <span>Year Level</span>
                        <span>Section</span>
                    </li>
                    </ul>
                </div>

              </div>

              {/* Placeholder Image */}
              <div className="w-full bg-gray-800 border border-dashed border-gray-600 rounded p-4 text-center">
                <p className="text-gray-500 text-sm mb-2">Sample Excel Format Preview</p>
                <div className="flex justify-center">
                    <img
                    src={excelImportExample}
                    alt="Excel Format Sample"
                    className="max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl max-h-48 object-contain rounded"
                    />
                </div>
               </div>

              {/* File Input */}
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-xs text-gray-300"
              />
            </div>

            {/* Footer */}
            <div className="py-4 flex gap-2 border-t border-gray-700 justify-end">
              <button
                onClick={(e) => {e.stopPropagation(); onClose()}}
                className="px-4 py-1.5 h-fit text-xs font-medium text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded"
              >
                Cancel
              </button>
              <button
                onClick={(e) => {e.stopPropagation(); handleImport}}
                disabled={isLoading || !file}
                className="px-4 py-1.5 h-fit text-xs font-medium text-white accent-bg hover:bg-blue-500 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Importing..." : "Import Profiles"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ImportProfiles;