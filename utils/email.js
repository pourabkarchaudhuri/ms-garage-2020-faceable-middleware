const axios = require('axios');

exports.sendEmail = async (body) => {
    const options = { 
        method: 'POST',
        url: `${process.env.LOGIC_APP_URL}`,
        data: body
    };

    const result = await axios.request(options);
    return result.data;
}