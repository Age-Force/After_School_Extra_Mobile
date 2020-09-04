import Vue from 'nativescript-vue';
import NS_CW3 from './components/NS_CW3';
import Search from './components/Search';

// Uncommment the following to see NativeScript-Vue output logs
// Vue.config.silent = false;


new Vue({

    template: `
        <Frame>
            <NS_CW3 />
        </Frame>`,

    components: {
        NS_CW3
    }
}).$start();