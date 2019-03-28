(function() {
	if (window.hasRun) {
		return;
	}
	window.hasRun = true;

	var dB = 0;

	var videoElements = document.querySelectorAll("video");
	var audioElements = document.querySelectorAll("audio");
	if (videoElements.length == 0 && audioElements.length == 0) {
		return;
	}
	var audioCtx = new AudioContext();
	var gainNode = audioCtx.createGain();

	function connectOutput(element) {
		audioCtx.createMediaElementSource(element).connect(gainNode);
		gainNode.connect(audioCtx.destination);
	}
	videoElements.forEach(connectOutput);
	audioElements.forEach(connectOutput);

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
