import agent from 'superagent';

const VISION_API_KEY = '[YOUR VISION API KEY]';
const VISION_API_URL = 'https://vision.googleapis.com/v1/images:annotate';

const annotate = (request) =>
  new Promise((resolve, reject) =>
    agent
      .post(`${VISION_API_URL}?key=${VISION_API_KEY}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send(request)
      .end((err, res) => err ? reject(err) : resolve(res.body))
  );

export default {annotate};
