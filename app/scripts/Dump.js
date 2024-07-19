const { execSync } = require('child_process');
const { format } = require('date-fns');
const { readFileSync, writeFileSync, mkdirSync, existsSync, unlinkSync } = require('fs');
const { resolve } = require('path');

const dumpsPath = resolve('dumps');
const dumpPath = resolve(dumpsPath, `${format(new Date(), 'yyyy-MM-dd-HH-mm-ss')}.sql`);
const credentialsPath = resolve(dumpsPath, 'credentials.cnf');

try {
    const args = process.argv.slice(2);
    const isData = args.includes('--data');

    const REGEXP_WITH_PASSWORD = /mysql:\/\/(.+):(.+)@.+\/(.+)\?/i;
    const REGEXP_WITHOUT_PASSWORD = /mysql:\/\/(.+)@.+\/(.+)\?/i;

    const env = readFileSync(resolve('.env'), { encoding: 'utf-8' });
    const [DATABASE_URL] = env.match(/DATABASE_URL=(.*)/i)?.slice(1) || [];

    if (!DATABASE_URL) throw new Error('DATABASE_URL not exist');

    let user;
    let password;
    let database;
    if (REGEXP_WITH_PASSWORD.test(DATABASE_URL)) {
        [user, password, database] = DATABASE_URL.match(REGEXP_WITH_PASSWORD)?.slice(1) || [];
    } else if (REGEXP_WITHOUT_PASSWORD.test(DATABASE_URL)) {
        [user, database] = DATABASE_URL.match(REGEXP_WITHOUT_PASSWORD)?.slice(1) || [];
    } else {
        throw new Error('DATABASE_URL invalid');
    }

    if (!existsSync(dumpsPath)) {
        mkdirSync(dumpsPath);
    }

    writeFileSync(
        credentialsPath,
        `
        [mysqldump]
        user=${user || ''}
        password=${password || ''}
        `
            .replace(/ {2,}/g, '')
            .trim()
    );

    const host = '186.249.48.232';
    const port = 3307;
    execSync(
        `mysqldump --defaults-file="${credentialsPath}" --column-statistics=0 --host="${host}" --port="${port}" ${
            isData ? '--no-create-info' : ''
        } ${database} > "${dumpPath}"`
    );
} catch (error) {
    console.log('Dump error:', error.message);
} finally {
    unlinkSync(credentialsPath);
}
