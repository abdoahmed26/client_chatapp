import { AnimatePresence } from "framer-motion";
import { useCallSocket } from "../hooks/useCallSocket";
import { useMediaDevices } from "../hooks/useMediaDevices";
import { useScreenShare } from "../hooks/useScreenShare";
import { useCallRecording } from "../hooks/useCallRecording";
import { useAppDispatch } from "@/store/hooks";
import {
  toggleMute,
  toggleCamera,
  toggleScreenShare,
  toggleRecording,
  resetCall,
} from "@/store/slices/callSlice";
import IncomingCallModal from "./IncomingCallModal";
import OutgoingCallOverlay from "./OutgoingCallOverlay";
import ActiveCallView from "./ActiveCallView";
import CallEndedSummary from "./CallEndedSummary";

/**
 * Root-level call overlay that renders the appropriate call UI based on Redux state.
 * Mount this once at the app root, inside the SocketProvider.
 */
export default function CallOverlay() {
  const dispatch = useAppDispatch();

  const {
    callState,
    localStream,
    remoteStream,
    acceptCurrentCall,
    rejectCurrentCall,
    endCurrentCall,
    startCall,
    replaceTrack,
  } = useCallSocket();

  const { toggleMic, toggleCamera: toggleCam } = useMediaDevices();

  const { startScreenShare, stopScreenShare } = useScreenShare(
    replaceTrack,
    localStream?.getVideoTracks()[0] || null
  );

  const {
    startRecording,
    stopRecording,
    downloadRecording,
  } = useCallRecording();

  // ─── Handlers ─────────────────────────────────────────────────

  const handleToggleMute = () => {
    toggleMic();
    dispatch(toggleMute());
  };

  const handleToggleCamera = () => {
    toggleCam();
    dispatch(toggleCamera());
  };

  const handleToggleScreenShare = async () => {
    if (callState.isScreenSharing) {
      stopScreenShare();
    } else {
      try {
        await startScreenShare();
      } catch {
        return; // User cancelled the screen share picker
      }
    }
    dispatch(toggleScreenShare());
  };

  const handleToggleRecording = () => {
    if (callState.isRecording) {
      stopRecording();
      downloadRecording();
    } else if (localStream && remoteStream) {
      startRecording([localStream, remoteStream]);
    }
    dispatch(toggleRecording());
  };

  const handleCallAgain = () => {
    if (callState.peer && callState.callType) {
      startCall({
        calleeId: callState.peer.id,
        calleeName: callState.peer.name,
        calleeProfileImage: callState.peer.profileImage,
        type: callState.callType,
      });
    }
  };

  const handleDismiss = () => {
    dispatch(resetCall());
  };

  // ─── Render ───────────────────────────────────────────────────

  return (
    <AnimatePresence mode="wait">
      {/* Incoming call */}
      {callState.status === "ringing" && callState.direction === "incoming" && callState.peer && callState.callType && (
        <IncomingCallModal
          key="incoming"
          peer={callState.peer}
          callType={callState.callType}
          onAccept={acceptCurrentCall}
          onReject={rejectCurrentCall}
        />
      )}

      {/* Outgoing call (ringing) */}
      {callState.status === "ringing" && callState.direction === "outgoing" && callState.peer && callState.callType && (
        <OutgoingCallOverlay
          key="outgoing"
          peer={callState.peer}
          callType={callState.callType}
          onCancel={endCurrentCall}
        />
      )}

      {/* Connecting / Ongoing */}
      {(callState.status === "connecting" || callState.status === "ongoing") && callState.peer && callState.callType && (
        <ActiveCallView
          key="active"
          peer={callState.peer}
          callType={callState.callType}
          duration={callState.duration}
          localStream={localStream}
          remoteStream={remoteStream}
          isMuted={callState.isMuted}
          isCameraOff={callState.isCameraOff}
          isScreenSharing={callState.isScreenSharing}
          isRecording={callState.isRecording}
          onToggleMute={handleToggleMute}
          onToggleCamera={handleToggleCamera}
          onToggleScreenShare={handleToggleScreenShare}
          onToggleRecording={handleToggleRecording}
          onEndCall={endCurrentCall}
        />
      )}

      {/* Call ended summary */}
      {callState.status === "ended" && callState.peer && callState.callType && (
        <CallEndedSummary
          key="ended"
          peer={callState.peer}
          callType={callState.callType}
          duration={callState.duration}
          onCallAgain={handleCallAgain}
          onDismiss={handleDismiss}
        />
      )}
    </AnimatePresence>
  );
}
