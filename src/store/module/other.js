export default {
    state: {
        number_list: [], // 玩法的选中值
    },
    getters: {
        getNumberList(state) {
            return state.number_list
        },
    },
    mutations: {
        setNumberList(state, val) {
            // console.log(val);
            state.number_list = val.filter(item => item !== '')
        },
        clearNumberList(state) {
            state.number_list = []
        }
    }
}