import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";

var _templateObject;

import _regeneratorRuntime from "@babel/runtime/regenerator";
import gql from "graphql-tag";
export var state = function () {
  return {
    zones: {
      content: []
    }
  };
};
export var getters = {
  zones: function zones(state) {
    return state.zones;
  }
};
export var mutations = {
  setZones: function setZones(state, payload) {
    state.zones = payload;
  }
};
export var actions = {
  zones: function zones(_ref, zoneData) {
    var _this = this;

    return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      var commit, _yield$_this$$vfapoll, data;

      return _regeneratorRuntime.wrap(function (_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              commit = _ref.commit;
              _context.prev = 1;
              _context.next = 4;
              return _this.$vfapollo.query({
                query: gql(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n          query($page: Int, $size: Int, $country_id: String) {\n            zonesList(page: $page, size: $size, country_id: $country_id) {\n              content {\n                id\n                name\n              }\n              totalPages\n              totalElements\n              first\n              last\n              number\n              numberOfElements\n            }\n          }\n        "]))),
                variables: zoneData
              });

            case 4:
              _yield$_this$$vfapoll = _context.sent;
              data = _yield$_this$$vfapoll.data;
              commit("setZones", data.zonesList);
              _context.next = 12;
              break;

            case 9:
              _context.prev = 9;
              _context.t0 = _context["catch"](1);
              commit("vuefront/setResponseError", _context.t0, {
                root: true
              });

            case 12:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[1, 9]]);
    }))();
  }
};