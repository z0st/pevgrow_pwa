import gql from "graphql-tag";

export const state = () => ({
  zones: {
    content: [],
  },
});

export const getters = {
  zones(state) {
    return state.zones;
  },
};

export const mutations = {
  setZones(state, payload) {
    state.zones = payload;
  },
};

export const actions = {
  async zones({ commit, dispatch, rootGetters }, zoneData) {
    await dispatch(
      "apollo/query",
      {
        query: gql`
          query($page: Int, $size: Int, $country_id: String) {
            zonesList(page: $page, size: $size, country_id: $country_id) {
              content {
                id
                name
              }
              totalPages
              totalElements
              first
              last
              number
              numberOfElements
            }
          }
        `,
        variables: zoneData,
      },
      {
        root: true,
      }
    );
    if (!rootGetters["vuefront/error"]) {
      commit("setZones", rootGetters["apollo/get"].zonesList);
    }
  },
};
