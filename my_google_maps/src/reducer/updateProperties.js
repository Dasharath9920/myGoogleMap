import actionTypes from "./actionTypes";

const initializer = {
    source: {
        r: 0,
        c: 0
    },
    destination: {
        r: 0,
        c: 0
    },
    map: [],
    cities: [],
    roads: new Set(),
    path: [],
    navigate: false,
    findPath: false,
};

const updateProperties = (state=initializer, action) => {
    switch(action.type){
        case actionTypes.UPDATE_CITIES:{
            return {...state, cities: action.cities};
        }

        case actionTypes.UPDATE_DESTINATION:{
            return {...state, destination: action.destination};
        }

        case actionTypes.UPDATE_FINDPATH:{
            return {...state, findPath: action.findPath};
        }

        case actionTypes.UPDATE_NAVIGATE:{
            return {...state, navigate: action.navigate};
        }

        case actionTypes.UPDATE_SOURCE:{
            return {...state, source: action.source};
        }

        case actionTypes.UPDATE_ROADS:{
            return {...state, roads: action.roads};
        }

        case actionTypes.UPDATE_SHORTESTPATH: {
            return {...state, path: action.path};
        }

        case actionTypes.UPDATE_MAP:{
            return {...state, map: action.map};
        }

        default:
            return state;
    }
}

export default updateProperties;