const platformCards = document.querySelectorAll('.platform-card');
const downloadButton = document.getElementById('downloadButton');
const downloadText = document.getElementById('downloadText');
const systemSoftware = document.getElementById('systemSoftware');
const systemVersion = document.getElementById('systemVersion');
const systemStatus = document.getElementById('systemStatus');

let selectedPlatform = 'windows';

const platformData = {
    windows: {
        name: 'ENZO WINDOWS',
        version: 'N/A',
        status: 'NOT RELEASED',
        downloadText: 'DOWNLOAD FOR WINDOWS'
    },
    android: {
        name: 'ENZO ANDROID',
        version: 'N/A',
        status: 'NOT RELEASED',
        downloadText: 'DOWNLOAD FOR ANDROID'
    },
    macos: {
        name: 'ENZO MACOS',
        version: 'N/A',
        status: 'NOT RELEASED',
        downloadText: 'DOWNLOAD FOR MACOS'
    }
};

function updatePlatform(platform) {
    selectedPlatform = platform;
    const data = platformData[platform];

    platformCards.forEach(card => {
        card.classList.remove('active');
        if (card.dataset.platform === platform) {
            card.classList.add('active');
        }
    });

    if (downloadText) downloadText.textContent = data.downloadText;
    if (systemSoftware) systemSoftware.textContent = data.name;
    if (systemVersion) systemVersion.textContent = data.version;
    if (systemStatus) systemStatus.textContent = data.status;
}

platformCards.forEach(card => {
    card.addEventListener('click', function() {
        const platform = this.dataset.platform;
        updatePlatform(platform);

        this.style.transform = 'translateY(-5px) scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 200);
    });
});

if (downloadButton) {
    downloadButton.addEventListener('click', function() {
        console.log(`Download initiated for ${selectedPlatform}`);
    });
}
