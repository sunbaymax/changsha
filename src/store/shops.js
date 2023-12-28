const state = {
    area : window.sessionStorage.getItem('area') || 'A5',
    curshop : '',
};

const actions = {

};

const mutations = {
    CITY_INFO(state,payload){
        state.area = payload.area;
        state.curshop = payload.curshop;
    }
};

export default {
    namespaced : true,
    state,
    actions,
    mutations
}