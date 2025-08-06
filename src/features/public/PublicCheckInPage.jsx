    import React, { useEffect, useRef, useState } from 'react';
    import { Html5QrcodeScanner, Html5QrcodeScanType, Html5QrcodeSupportedFormats } from 'html5-qrcode';
    import { useParams } from 'react-router';
    import { useParticipants } from '../../contexts/ParticipantsContext';
    import { toast } from 'sonner';
    import { Typography } from '@material-tailwind/react';

    function PublicCheckInPage() {
    const { workspaceID, eventID } = useParams();
    const { getParticipantsByEvent, updateParticipantStatus } = useParticipants();

    const scannerRef = useRef(null);
    const [scannedID, setScannedID] = useState('');
    const [isCheckingIn, setIsCheckingIn] = useState(false);

    const [eventParticipants, setEventParticipants] = useState();

    const getParticipants = async () => {
        const participants = await getParticipantsByEvent(workspaceID, eventID)
        setEventParticipants(participants);
    }

    useEffect(() => {
        getParticipants();
    }, [])

    useEffect(() => {
    const scanner = new Html5QrcodeScanner(
        "qr-reader",
        {
        fps: 10,
        qrbox: 300,
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
        scanner.clear().catch((err) => console.error("Cleanup error", err));
    };
    }, [isCheckingIn]);


    const handleCheckIn = async () => {
        console.log(eventParticipants)
        const participant = eventParticipants.find(p => p.IDNumber === scannedID);
        if (!participant) {
        toast.error("Participant not found");
        return;
        }

        if (participant.status === 'attended') {
        toast.warning("Participant already checked in");
        return;
        }

        try {
        setIsCheckingIn(true);
        await updateParticipantStatus(workspaceID, eventID, participant.id, 'attended');
        getParticipants();
        toast.success("Checked in successfully");
        } catch (err) {
        console.error(err);
        toast.error("Check-in failed");
        } finally {
        setIsCheckingIn(false);
        }
    };

    return (
        <div className='flex flex-col h-[100vh] overflow-y-auto primary px-4 sm:px-10 py-2'>
        <div className='flex justify-end items-center px-4 sm:px-10 py-3 w-full'>
            <p className='text-xs text-gray-400 font-semibold'>You are logged in as <span className='text-color'>Guest</span></p>
        </div>

        <div className='flex justify-center items-center w-full px-4 sm:px-10 h-full'>
            <div className='flex flex-col items-center gap-4 w-full max-w-2xl'>
            <div className='flex flex-col justify-center items-center gap-4 text-center'>
                <p className='text-color text-2xl font-semibold'>Scan Participant QR Code</p>
                <p className='text-color-secondary text-sm font-semibold'>Make sure the QR code is visible inside the scanner box</p>
            </div>

            <div className='secondary flex flex-col justify-center items-center w-fit min-w-[320px] rounded-lg max-h-[60vh] p-4'>
                <div id="qr-reader" className="w-full max-w-md aspect-video rounded-md overflow-hidden bg-black" ref={scannerRef}></div>

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

            <p className='text-gray-400 text-xs max-w-md text-center mt-4'>
                Note: Once a participant has checked in, their status will be marked as attended. Duplicate scans will not count.
            </p>
            </div>
        </div>
        </div>
    );
    }

    export default PublicCheckInPage;
