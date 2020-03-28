const Bull = require('bull');

// A queue instance can normally have 3 main different roles: A job producer, a job consumer or/and an events listener.

// An important aspect is that producers can add jobs to a queue even if there are no consumers available at that moment: queues provide asynchronous communication, which is one of the features that makes them so powerful.

// A consumer or worker (we will use these two terms interchangeably in this guide), is nothing more than a Node program that defines a process

const doStuff = async () => {
  const myFirstQueue = new Bull('my-first-queue');

  // Producer
  const job = await myFirstQueue.add({
    foo: 'bar',
  });

  // actual function to run
  const doSomething = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, data: {} });
      }, 5000);
    });
  };

  // Consumer
  myFirstQueue.process(async (job) => {
    return doSomething(job.data);
  });

  // Listener
  myFirstQueue.on('completed', (job, result) => {
    console.log(`Job: ${job} completed with result ${result}`);
  });
};

doStuff();
