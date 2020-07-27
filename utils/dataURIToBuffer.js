module.exports = async (dataURL) => {
    const buff = Buffer.from(dataURL.replace(/^data:image\/(png|gif|jpeg);base64,/, ''), 'base64');
    return buff;
}