let loadtest;

import('loadtest').then((module) => {
  loadtest = module;

  function statusCallback(error, result, latency) {
    console.log(
      'Current latency %j, result %j, error %j',
      latency,
      result,
      error,
    );
    console.log('----');
    console.log('Request elapsed milliseconds: ', result.requestElapsed);
    console.log('Request index: ', result.requestIndex);
    console.log('Request loadtest() instance index: ', result.instanceIndex);
  }

  const options = {
    url: 'http://localhost:3000/api/user/bookFile/2',
    method: 'POST',
    maxRequests: 100,
    statusCallback: statusCallback,
  };

  loadtest.loadTest(options, function (error) {
    if (error) {
      return console.error('Got an error: %s', error);
    }
    console.log('Tests run successfully');
  });
});
