const childProcess = require('child_process');

function cmd(command) {
	childProcess.execSync(command, { stdio : 'inherit' });
}

module.exports = cmd;