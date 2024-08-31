const os = require('os');
const { exec } = require('child_process');

const monitorCPU = () => {
  setInterval(() => {
    const load = os.loadavg()[0];
    const cpuCores = os.cpus().length;
    const cpuUsage = (load / cpuCores) * 100;

    console.log(`Current CPU Usage: ${cpuUsage.toFixed(2)}%`);

    if (cpuUsage > 70) {
      console.warn('CPU usage exceeded 70%, restarting server...');
      exec('pm2 restart all', (error, stdout, stderr) => {
        if (error) {
          console.error(`Error restarting server: ${error.message}`);
          return;
        }
        console.log('Server restarted successfully');
      });
    }
  }, 10000); 
};

module.exports = monitorCPU;
