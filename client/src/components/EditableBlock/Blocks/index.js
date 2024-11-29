import { importAll } from '../../../utils/importAll';

const context = require.context('.', false, /\.js$/);
const blocks = importAll(context);

export default blocks;