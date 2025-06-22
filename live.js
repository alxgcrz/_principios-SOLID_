const readline = require('readline');
const { execSync } = require('child_process');

const html = process.env.npm_package_config_html || 'index.html';

const options = [
  { key: '1', alias: 'F', name: 'Firefox', browser: 'firefox' },
  { key: '2', alias: 'C', name: 'Chrome', browser: 'chrome' },
  { key: '3', alias: 'E', name: 'Edge', browser: 'msedge' }
];

function printMenu() {
  console.log('\nSelecciona un navegador:\n');
  options.forEach(opt => {
    console.log(`  [${opt.key}] ${opt.name} (${opt.alias})`);
  });
  console.log('  [Enter] por defecto: Edge');
}

function run(browser) {
  console.log(`\n🚀 Abriendo "${html}" con live-server en ${browser}...\n`);
  execSync(`live-server ${html} --browser=${browser}`, { stdio: 'inherit' });
}

function getBrowserFromKey(key) {
  const match = options.find(opt =>
    opt.key === key || opt.alias.toLowerCase() === key.toLowerCase()
  );
  return match?.browser || 'msedge';
}

printMenu();

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on('keypress', (str, key) => {
  process.stdin.setRawMode(false);
  process.stdin.pause();

  if (key.name === 'return') {
    run('msedge');
  } else {
    const browser = getBrowserFromKey(str);
    run(browser);
  }
});
