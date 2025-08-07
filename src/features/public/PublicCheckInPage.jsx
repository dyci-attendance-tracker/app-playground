    import React, { useEffect, useRef, useState } from 'react';
    import { Html5QrcodeScanner, Html5QrcodeScanType, Html5QrcodeSupportedFormats } from 'html5-qrcode';
    import { useParams } from 'react-router';
    import { useParticipants } from '../../contexts/ParticipantsContext';
    import { toast } from 'sonner';
    import { Typography } from '@material-tailwind/react';
    import { clearOfflineCheckIns, getOfflineCheckIns, saveOfflineCheckIn } from '../../utils/offlineCheckins';

    function PublicCheckInPage() {
    const { workspaceID, eventID } = useParams();
    const { getParticipantsByEvent, updateParticipantStatusByScan } = useParticipants();

    const scannerRef = useRef(null);
    const [scannedID, setScannedID] = useState('');
    const [isCheckingIn, setIsCheckingIn] = useState(false);

    const [eventParticipants, setEventParticipants] = useState();

    const [isOnline, setIsOnline] = useState(navigator.onLine);

    const getParticipants = async () => {
        const participants = await getParticipantsByEvent(workspaceID, eventID)
        setEventParticipants(participants);
    }

    const savedCheckIns = getOfflineCheckIns();

    useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);

    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    return () => {
        window.removeEventListener('online', goOnline);
        window.removeEventListener('offline', goOffline);
    };
    }, []);

    useEffect(() => {
        getParticipants();
    }, [])

    useEffect(() => {
    const scanner = new Html5QrcodeScanner(
        "qr-reader",
        {
        fps: 10,
        qrbox: 500,
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
        formatsToSupport: [
            Html5QrcodeSupportedFormats.QR_CODE,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.CODE_39,        // Optional but common
            Html5QrcodeSupportedFormats.DATA_MATRIX     // Optional
        ]
        },
        false
    );

    scanner.render(
        (decodedText, decodedResult) => {
        if (!isCheckingIn) {
            console.log("Scanned:", decodedText, decodedResult); // 🔍 Debug
            setScannedID(decodedText);
        }
        },
        (error) => {
        if (error?.name !== "NotFoundException") {
            console.warn("Scan error:", error);
        }
        }
    );

    return () => {
        // scanner.clear().catch((err) => console.error("Cleanup error", err));
    };
    }, [isCheckingIn]);

    useEffect(() => {
        const handleReconnect = async () => {
            const savedCheckIns = getOfflineCheckIns();
            if (savedCheckIns.length === 0) return;

            for (const checkIn of savedCheckIns) {
            try {
                await updateParticipantStatusByScan(
                checkIn.workspaceID,
                checkIn.eventID,
                checkIn.participantID,
                'attended'
                );
            } catch (err) {
                console.error("Sync failed:", err);
            }
            }

            clearOfflineCheckIns();
            toast.success(`${savedCheckIns.length} offline check-in(s) synced`);
            getParticipants();
        };

        window.addEventListener("online", handleReconnect);
        return () => window.removeEventListener("online", handleReconnect);
    }, []);


    

    const handleCheckIn = async () => {
        const participant = eventParticipants.find(p => p.IDNumber === scannedID);
        if (!participant) {
            toast.error("Participant not found");
            return;
        }

        if (participant.status === 'attended') {
            toast.warning("Participant already checked in");
            return;
        }

        const checkInData = {
            participantID: participant.id,
            IDNumber: scannedID,
            timestamp: new Date().toISOString(),
            workspaceID,
            eventID,
        };

        if (isOnline) {
            try {
            setIsCheckingIn(true);
            await updateParticipantStatusByScan(workspaceID, eventID, participant.id, 'attended');
            toast.success("Check-in successful");
            getParticipants();
            } catch (err) {
            console.error(err);
            toast.error("Check-in failed");
            } finally {
            setIsCheckingIn(false);
            }
        } else {
            saveOfflineCheckIn(checkInData);
            toast.warning("Offline – saved check-in locally");
        }

        setScannedID("");
    };


    const handleManualSync = async () => {
        const saved = getOfflineCheckIns();
        for (const checkIn of saved) {
            try {
            await updateParticipantStatusByScan(
                checkIn.workspaceID,
                checkIn.eventID,
                checkIn.participantID,
                'attended'
            );
            } catch (err) {
            toast.error("Manual sync failed");
            return;
            }
        }

        clearOfflineCheckIns();
        toast.success("Manual sync complete");
        getParticipants();
    };



    return (
        <div className='flex flex-col h-[100vh] overflow-y-auto primary px-4 sm:px-10 py-2'>
        <div className='flex justify-between items-center px-4 sm:px-10 py-3 w-full'>
            <p className="text-xs text-gray-400">
                Status: {isOnline ? (
                    <span className="text-green-400 font-bold">Online</span>
                ) : (
                    <span className="text-red-400 font-bold">Offline</span>
                )}
            </p>
            <p className='text-xs text-gray-400 font-semibold'>You are logged in as <span className='text-color'>Guest</span></p>
        </div>

        <div className='flex justify-center items-center w-full px-4 sm:px-10 h-full'>
            <div className='flex flex-col items-center gap-4 w-full max-w-2xl'>
            <div className='flex flex-col justify-center items-center gap-4 text-center'>
                <p className='text-color text-2xl font-semibold'>Scan Participant QR Code</p>
                <p className='text-color-secondary text-sm font-semibold'>Make sure the QR code is visible inside the scanner box</p>
            </div>

            <div className='secondary flex flex-col justify-center items-center w-fit min-w-[350px] lg:min-w-[500px] rounded-lg max-h-[60vh] p-4'>
                <div id="qr-reader" className="w-fit max-w-lg min-w-[350px] aspect-video rounded-md overflow-hidden flex flex-col  items-center" ref={scannerRef}></div>

                <input
                type="text"
                value={scannedID}
                onChange={(e) => setScannedID(e.target.value)}
                placeholder="Scanned ID will appear here"
                className="mt-4 w-full max-w-md px-4 py-2 rounded border border-gray-700 bg-gray-800 text-white text-sm"
                />
            </div>

            <button
                onClick={handleCheckIn}
                disabled={!scannedID || isCheckingIn}
                className='accent-bg text-white w-full max-w-xs flex items-center justify-center py-2.5 px-4 rounded-md font-medium hover:bg-opacity-90 transition-colors mt-2 disabled:opacity-60'
            >
                {isCheckingIn ? "Checking In..." : "Check In"}
            </button>

            {/* {savedCheckIns && (
                <button
                    onClick={handleManualSync}
                    className='bg-yellow-500 text-white w-full max-w-xs flex items-center justify-center py-2.5 px-4 rounded-md font-medium hover:bg-opacity-90 transition-colors mt-2'
                >
                    Sync Offline Data
                </button>
            )} */}


            <p className='text-gray-400 text-xs max-w-md text-center mt-4'>
                Note: Once a participant has checked in, their status will be marked as attended. Duplicate scans will not count.
            </p>

            <p className='text-color-secondary text-xs max-w-md text-center mt-4'>
                Developed by: Franc Alvenn Dela Cruz
            </p>
            </div>
        </div>
        </div>
    );
    }

    export default PublicCheckInPage;
