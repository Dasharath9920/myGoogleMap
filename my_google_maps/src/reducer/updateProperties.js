import actionTypes from "./actionTypes";

const initializer = {
    source: 0,
    destination: 0,
    map: [],
    cities: [],
    path: [],
    stops: [],
    roads: new Set(),
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

        case actionTypes.UPDATE_STOPS:{
            return {...state, stops: action.stops};
        }

        default:
            return state;
    }
}

export default updateProperties;