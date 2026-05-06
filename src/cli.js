import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { generateRetrievalConfig } from './config.js';
import { initDataset } from './init.js';
import { inspectDataset, renderMarkdownReport } from './inspect.js';
import { verifyDataset } from './verify.js';
import { writeJson } from './fs-utils.js';

const VERSION = '0.1.0';

function help() {
  return `colbertcache ${VERSION}\n\nLocal fixture mirror manager for retrieval demos.\n\nUsage:\n  colbertcache inspect <dataset> [--format json|markdown] [--output <file>] [--strict]\n  colbertcache verify <dataset> [--strict] [--json]\n  colbertcache config <dataset> [--output <file>] [--name <demo-name>]\n  colbertcache init <dataset> [--name <dataset-name>]\n  colbertcache --help\n  colbertcache --version\n`;
}

function parseFlags(args) {
  const flags = {};
  const positional = [];
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      if (['strict', 'json', 'help', 'version'].includes(key)) {
        flags[key] = true;
      } else {
        flags[key] = args[index + 1];
        index += 1;
      }
    } else {
      positional.push(arg);
    }
  }
  return { flags, positional };
}

async function emit(output, target) {
  if (target) {
    await writeFile(path.resolve(target), output, 'utf8');
  } else {
    process.stdout.write(output);
  }
}

export async function runCli(args) {
  const { flags, positional } = parseFlags(args);
  const command = positional[0];
  if (!command || flags.help || command === 'help' || command === '--help') {
    process.stdout.write(help());
    return;
  }
  if (flags.version || command === '--version' || command === '-v') {
    process.stdout.write(`${VERSION}\n`);
    return;
  }

  const dataset = positional[1];
  if (!dataset) throw new Error(`Missing dataset path.\n\n${help()}`);

  if (command === 'inspect') {
    const report = await inspectDataset(dataset, { strict: flags.strict });
    const format = flags.format || 'json';
    const output = format === 'markdown' ? renderMarkdownReport(report) : `${JSON.stringify(report, null, 2)}\n`;
    await emit(output, flags.output);
    return;
  }

  if (command === 'verify') {
    const result = await verifyDataset(dataset, { strict: flags.strict });
    if (flags.json) {
      await emit(`${JSON.stringify(result, null, 2)}\n`, flags.output);
    } else {
      await emit(`${result.ok ? 'PASS' : 'FAIL'} ${result.dataset}: ${result.summary.verifiedFiles}/${result.summary.expectedFiles} files verified, ${result.summary.extraFiles} extras\n`, flags.output);
    }
    if (!result.ok) process.exitCode = 1;
    return;
  }

  if (command === 'config') {
    const config = await generateRetrievalConfig(dataset, { name: flags.name });
    if (flags.output) await writeJson(path.resolve(flags.output), config);
    else process.stdout.write(`${JSON.stringify(config, null, 2)}\n`);
    return;
  }

  if (command === 'init') {
    const result = await initDataset(dataset, { name: flags.name });
    process.stdout.write(`Created ${result.manifestPath}\n`);
    return;
  }

  throw new Error(`Unknown command: ${command}\n\n${help()}`);
}
