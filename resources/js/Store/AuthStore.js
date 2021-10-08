import { observable, action, makeAutoObservable } from 'mobx';
import CryptoJS from 'crypto-js';
import encode from 'jwt-encode';
import decode from 'jwt-decode';

class AuthStore {
    appState = null;

    constructor() {
        makeAutoObservable(this, {
            appState: observable,
            saveToken: action,
            getToken: action,
        });
    }

    saveToken = (appState) => {
        try {
            localStorage.setItem('appState', CryptoJS.AES.encrypt(encode(appState, 'secret'), 'secret_code').toString());
            this.getToken();
        } catch (e) {
            console.log(e);
        }
    };

    getToken = () => {
        try {
            const data = localStorage.getItem('appState');
            if (data) {
                var bytes = CryptoJS.AES.decrypt(data, 'secret_code');
                var orginalText = bytes.toString(CryptoJS.enc.Utf8);
                this.appState = decode(orginalText);
            } else {
                this.appState = null;
            }
        } catch (e) {
            console.log(e);
        }
    };

    removeToken = () => {
        localStorage.removeItem('appState');
        this.appState = null;
    }

}

export default new AuthStore();
