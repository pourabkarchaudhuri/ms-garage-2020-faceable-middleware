const axios = require('axios');

exports.detect = async (buff) => {
    const options = {
        method: 'POST',
        url: `${process.env.FACE_API_ENDPOINT}/detect`,
        params:{
            returnFaceId: 'true',
            returnFaceLandmarks: 'false',
            recognitionModel: 'recognition_02',
            returnRecognitionModel: 'false'
        },
        headers:{
            'Ocp-Apim-Subscription-Key': `${process.env.FACE_API_SUBSCRIPTION_KEY}`,
            'Content-Type': 'application/octet-stream'
        },
        data: buff
    };

    const result = await axios.request(options);
    return result.data;
}

exports.createPerson = async (empId) => {
    const options = { 
        method: 'POST',
        url: `${process.env.FACE_API_ENDPOINT}/largepersongroups/${process.env.LARGE_PERSON_GROUP}/persons`,
        headers: { 
            'Ocp-Apim-Subscription-Key': `${process.env.FACE_API_SUBSCRIPTION_KEY}`,
            'Content-Type': 'application/json'
        },
        data: { 
            name: empId,
            userData: 'User-provided data attached to the person.'
        },
    };

    const result = await axios.request(options);
    return result.data;
}

exports.addFace = async (buff, personId) => {
    const options = { 
        method: 'POST',
        url: `${process.env.FACE_API_ENDPOINT}/largepersongroups/${process.env.LARGE_PERSON_GROUP}/persons/${personId}/persistedfaces`,
        headers: {
            'Ocp-Apim-Subscription-Key': `${process.env.FACE_API_SUBSCRIPTION_KEY}`,
            'Content-Type': 'application/octet-stream'//application/octet-stream 
        },
        data: buff
    };

    const result = await axios.request(options);
    return result.data;
}

exports.train = async () => {
    const  options = { 
        method: 'POST',
        url: `${process.env.FACE_API_ENDPOINT}/largepersongroups/${process.env.LARGE_PERSON_GROUP}/train`,
        headers: {
            'Ocp-Apim-Subscription-Key': `${process.env.FACE_API_SUBSCRIPTION_KEY}` 
        }
    };

    const result = await axios.request(options);
    return result.data;
}

exports.deletePerson = async (personGroupId, personId) => {
    const  options = { 
        method: 'DELETE',
        url: `${process.env.FACE_API_ENDPOINT}/largepersongroups/'${personGroupId}/persons/${personId}`,
        headers: {
            'Ocp-Apim-Subscription-Key': `${process.env.FACE_API_SUBSCRIPTION_KEY}`
        } 
    };

    const result = await axios.request(options);
    return result.data;
}

exports.identify = async (faceId) => {
    const  options = {
        method: 'POST',
        url: `${process.env.FACE_API_ENDPOINT}/identify`,
        headers: {
            'Ocp-Apim-Subscription-Key': `${process.env.FACE_API_SUBSCRIPTION_KEY}`,
            'Content-Type': 'application/json'
        },
        data: {
            largePersonGroupId: process.env.LARGE_PERSON_GROUP,
            faceIds: [faceId],
            maxNumOfCandidatesReturned: 1,
            confidenceThreshold: 0.89
        },
    };

    const result = await axios.request(options);
    return result.data;
}

exports.getFace = async (personId) => {
    const options = {
        method: 'GET',
        url: `${process.env.FACE_API_ENDPOINT}/largepersongroups/${process.env.LARGE_PERSON_GROUP}/persons/${personId}`,
        headers: {
            'Ocp-Apim-Subscription-Key': `${process.env.FACE_API_SUBSCRIPTION_KEY}`
        }
    };

    const result = await axios.request(options);
    return result.data;
}
