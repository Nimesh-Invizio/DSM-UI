function generateRandomDeviceId() {
    const charset = 'abcdef0123456789';

    let result = [];

    for (let i = 0; i < 16; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);

        result.push(charset[randomIndex]);
    }

    return result.join('');
};

module.exports = {
    generateRandomDeviceId,
}
