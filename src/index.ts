import { App } from './components/App';
import './scss/styles.scss';

const app = new App();
(async () => {
    await app.init();
})();
