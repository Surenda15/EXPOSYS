const localVideo = document.getElementById('localVideo');
        const remoteVideo = document.getElementById('remoteVideo');
        const startButton = document.getElementById('startButton');
        const stopButton = document.getElementById('stopButton');
        const connectButton = document.getElementById('connectButton');
        const AudiotButton = document.getElementById('audiocontrol');
        const VideoButton = document.getElementById('videocontrol');
        
        
        let localStream;
        let peer;
        let peerConnection;
        
        startButton.addEventListener('click', startCall);
        stopButton.addEventListener('click', stopCall);
        connectButton.addEventListener('click', initiateCall);
        AudiotButton.addEventListener('click',toggleAudio );
        VideoButton.addEventListener('click',toggleVideo );
       
        
        function initializePeer() {
            peer = new Peer(); // You can add your own PeerJS API key here
            
            peer.on('open', peerId => {
                console.log('My peer ID:', peerId);
            });
            
            peer.on('call', incomingCall => {
                answerCall(incomingCall);
            });
            
            peer.on('error', error => {
                console.error('PeerJS error:', error);
            });
        }
        
        async function startCall() {
            try {
                localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                localVideo.srcObject = localStream;
                
                peerConnection = new RTCPeerConnection();
                localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
                
                peerConnection.ontrack = event => {
                    remoteVideo.srcObject = event.streams[0];
                };
                
                initializePeer();
                connectButton.disabled = false;
                
            } catch (error) {
                console.error('Error starting call:', error);
            }
        }
        
        async function initiateCall() {
            const remotePeerId = prompt('Enter the remote peer ID:');
            if (remotePeerId) {
                const call = peer.call(remotePeerId, localStream);
                answerCall(call);
            }
        }
        
        function answerCall(incomingCall) {
            incomingCall.answer(localStream);
            incomingCall.on('stream', remoteStream => {
                remoteVideo.srcObject = remoteStream;
            });
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
        