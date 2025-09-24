import users from './data/users.js';
import _gameData from './data/game_data.js';
import gameState from './data/game_state.js';
import caseStudy from './data/case_study.js';

const allQuartersData = {
    '0': JSON.parse(JSON.stringify(_gameData)),
    '1': JSON.parse(JSON.stringify(_gameData)),
    '2': JSON.parse(JSON.stringify(_gameData))
};

const stubs = {
    'auth/login': (user, data) => {
        var _user = null;

        users.every(u => {
            if (u.email == data.email && u.password == data.password)
            {
                _user = u;
                return false;
            }
            return true;
        });

        if (!_user)
        {
            return {rc: 'Invalid email or password'};
        }

        return { rc: "success", data: _user};
    },

    'auth/logout': function (user, data) {
        return {rc: 'success'};
    },

    'user/game_data': (user, data) => {
        // strategy:
        // there would be a user record for each user
        // then there would be game record which is per game
        // while reading backend system would return all data
        const output = {
            allQuartersData: allQuartersData,
            gameState: gameState,
            caseStudy: caseStudy
        };
        return {rc: 'success', data: output};
    },

    'website/site_data': (user, data) => {
        // Return basic site configuration data
        const siteData = [
            { key: 'theme', value: 'default' },
            { key: 'branding', value: 'parasim' },
            { key: 'version', value: '1.0.0' }
        ];
        return {rc: 'success', data: siteData};
    },
};

export const dummyCall = async (service, user, data) => {
    const delay = ms => new Promise(res => setTimeout(res, ms));
    await delay(parseInt(Math.random() * 200));
    if (!stubs[service])
    {
        return {rc: 'stub not defined: ' + service};
    }
    return stubs[service](user, data);
};


