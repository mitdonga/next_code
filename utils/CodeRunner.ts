import Docker from 'dockerode';

const docker = new Docker();

export default async function CodeRunner(code: String, lang="javascript"){
  return new Promise<String>(async (resolve, reject) => {
    try {
      let command = ''
      let image = 'node:18'
      switch (lang) {
        case "javascript":
          command = `echo "${code}" >> index.js && node .`
          break;
        case "ruby":
          image = 'ruby:3.1'
          command = `echo "${code}" >> index.rb && ruby index.rb`
          break;
        default:
          throw new Error("Please enter a valid language. Allowed languages are JavaScript, and Ruby..")
      }
      let output = ""
      const container = await docker.createContainer({
        Image: image,
        Cmd: ['/bin/sh', '-c', command],
        HostConfig: {
          Memory: 50560000
        }
      })

      await container.start()
      container.logs({ follow: true, stdout: true, stderr: true }, (err, stream) => {
        if (err) {
          console.error('Error capturing logs:', err);
        } else {
          if (stream){
            stream.on('data', (chunk) => {
              output += chunk.toString('utf8');
            });

            stream.on('end', () => {
              console.log('Final output: ')
              container.remove();
              resolve(output);
            })

            stream.on('error', (err) => {
              console.log('Got some error..', err)
              container.remove();
              resolve(output);
            })
          }
        }
      });
    } catch (err){
      reject(err);
    }
  })

}
