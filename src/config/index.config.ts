import * as fs from 'fs';
import * as path from 'path';
import devConfig from './development.config';

const privateKey = fs.readFileSync(path.resolve(__dirname, '../../assets/certificates/private.key'), 'utf8');
const publicKey = fs.readFileSync(path.resolve(__dirname, '../../assets/certificates/public.key'), 'utf8');

export const moduleLoad = [devConfig, () => ({ rsa: { private: privateKey, public: publicKey } })];
