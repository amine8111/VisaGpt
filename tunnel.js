const localtunnel = require('localtunnel');

async function startTunnel() {
  console.log('Starting tunnel to localhost:8080...');
  
  try {
    const tunnel = await localtunnel({ port: 8080 });
    
    console.log('\n🎉 YOUR PUBLIC LINK IS READY:\n');
    console.log(`   ${tunnel.url}\n`);
    console.log('Share this link with your partners!\n');
    console.log('Press Ctrl+C to stop the tunnel\n');
    
    tunnel.on('close', () => {
      console.log('Tunnel closed');
    });
  } catch (err) {
    console.error('Failed to start tunnel:', err.message);
  }
}

startTunnel();
