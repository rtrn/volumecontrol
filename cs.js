(function() {
	if (window.hasRun) {
		return;
	}
	window.hasRun = true;

	var dB = 0;

	function connectOutput(audioCtx, gainNode, element) {
		audioCtx.createMediaElementSource(element).connect(gainNode);
		gainNode.connect(audioCtx.destination);
	}

	var videoElement = document.querySelector("video");
	var audioElement = document.querySelector("audio");
	if (videoElement == null && audioElement == null) {
		return;
	}
	var audioCtx = new AudioContext();
	var gainNode = audioCtx.createGain();
	if (videoElement != null) {
		connectOutput(audioCtx, gainNode, videoElement);
	}
	if (audioElement != null) {
		connectOutput(audioCtx, gainNode, audioElement);
	}

	function setVolume(dB) {
		gainNode.gain.value = Math.pow(10, dB/20);
	}

	browser.runtime.onMessage.addListener((message) => {
		if (message.command == "setVolume") {
			dB = message.dB;
			setVolume(dB);
		} else if (message.command == "getVolume") {
			return Promise.resolve({response: dB});
		}
	});
})();
