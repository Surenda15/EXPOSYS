const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const muteAudioButton = document.getElementById('muteAudioButton');
const muteVideoButton = document.getElementById('muteVideoButton');
const pID = document.getElementById('Peer');
const remotePeerIdInput = document.getElementById('remotePeerId');
const connectButton = document.getElementById('connectButton'); // Corrected ID

let localStream;
let peerConnection;
let peer;

startButton.addEventListener('click', startCall);
stopButton.addEventListener('click', stopCall);
muteAudioButton.addEventListener('click', toggleAudio);
muteVideoButton.addEventListener('click', toggleVideo);
connectButton.addEventListener('click', connectToHost); // Corrected ID

async function startCall() {
    try {
        peer = new Peer(); // Use the same peer instance for connecting to the opposite peer

        peer.on('open', async (peerId) => {
            console.log('My peer ID:', peerId);
            pID.innerHTML= "PEERID"+"="+peerId;

            localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localVideo.srcObject = localStream;

            peerConnection = new RTCPeerConnection();
            localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

            peerConnection.ontrack = event => {
                remoteVideo.srcObject = event.streams[0];
            };
        });

    } catch (error) {
        console.error('Error starting call:', error);
    }
}

async function connectToHost() {
    try {
        const remotePeerId = remotePeerIdInput.value;
        
        const call = peer.call(remotePeerId, localStream);
        
        call.on('stream', remoteStream => {
            remoteVideo.srcObject = remoteStream;
        });

    } catch (error) {
        console.error('Error connecting to host:', error);
    }
}

function stopCall() {
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
    }
    if (peerConnection) {
        peerConnection.close();
    }
    localVideo.srcObject = null;
    remoteVideo.srcObject = null;
}

function toggleAudio() {
    if (localStream) {
        const audioTracks = localStream.getAudioTracks();
        audioTracks.forEach(track => track.enabled = !track.enabled);
    }
}

function toggleVideo() {
    if (localStream) {
        const videoTracks = localStream.getVideoTracks();
        videoTracks.forEach(track => track.enabled = !track.enabled);
    }
}
