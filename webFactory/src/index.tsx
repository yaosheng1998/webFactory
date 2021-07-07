import React from 'react';
import ReactDOM from 'react-dom';
import { hot, AppContainer } from 'react-hot-loader';
import Root from '@/Root';
import './global.less';
const render = () => {
    ReactDOM.render(
        <AppContainer>
            <Root />
        </AppContainer>,
        document.getElementById('root')
    );
};

render();

if ((module as any).hot) {
    (module as any).hot.accept('@/Root', () => {
        render();
    });
}
