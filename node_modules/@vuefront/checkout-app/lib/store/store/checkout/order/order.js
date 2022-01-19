import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";

var _templateObject, _templateObject2, _templateObject3;

import _regeneratorRuntime from "@babel/runtime/regenerator";
import gql from "graphql-tag";
export var state = function () {
  return {
    order: {},
    url: ""
  };
};
export var getters = {
  order: function order(state) {
    return state.order;
  },
  url: function url(state) {
    return state.url;
  }
};
export var mutations = {
  setOrder: function setOrder(state, payload) {
    state.order = payload;
  },
  setUrl: function setUrl(state, payload) {
    state.url = payload;
  }
};
export var actions = {
  create: function create(_ref) {
    var _this = this;

    return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      var commit;
      return _regeneratorRuntime.wrap(function (_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              commit = _ref.commit;
              _context.prev = 1;
              _context.next = 4;
              return _this.$vfapollo.mutate({
                mutation: gql(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n          mutation {\n            createOrder {\n              success\n            }\n          }\n        "])))
              });

            case 4:
              _context.next = 9;
              break;

            case 6:
              _context.prev = 6;
              _context.t0 = _context["catch"](1);
              commit("vuefront/setResponseError", _context.t0, {
                root: true
              });

            case 9:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[1, 6]]);
    }))();
  },
  update: function update(_ref2, payload) {
    var _this2 = this;

    return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
      var commit, _yield$_this2$$vfapol, data;

      return _regeneratorRuntime.wrap(function (_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              commit = _ref2.commit;
              _context2.prev = 1;
              _context2.next = 4;
              return _this2.$vfapollo.mutate({
                mutation: gql(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n          mutation (\n            $paymentAddress: [InputField]\n            $paymentAddressId: String\n            $shippingAddressId: String\n            $shippingAddress: [InputField]\n            $paymentMethod: String\n            $shippingMethod: String\n          ) {\n            updateOrder(\n              paymentAddress: $paymentAddress\n              shippingAddress: $shippingAddress\n              shippingAddressId: $shippingAddressId\n              paymentAddressId: $paymentAddressId\n              paymentMethod: $paymentMethod\n              shippingMethod: $shippingMethod\n            ) {\n              shippingMethods {\n                id\n                codename\n                name\n              }\n              totals {\n                title\n                text\n              }\n            }\n          }\n        "]))),
                variables: payload
              });

            case 4:
              _yield$_this2$$vfapol = _context2.sent;
              data = _yield$_this2$$vfapol.data;
              return _context2.abrupt("return", data);

            case 9:
              _context2.prev = 9;
              _context2.t0 = _context2["catch"](1);
              commit("vuefront/setResponseError", _context2.t0, {
                root: true
              });

            case 12:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[1, 9]]);
    }))();
  },
  confirm: function confirm(_ref3) {
    var _this3 = this;

    return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3() {
      var commit, _yield$_this3$$vfapol, data;

      return _regeneratorRuntime.wrap(function (_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              commit = _ref3.commit;
              _context3.prev = 1;
              _context3.next = 4;
              return _this3.$vfapollo.mutate({
                mutation: gql(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n          mutation {\n            confirmOrder {\n              order {\n                id\n              }\n              url\n            }\n          }\n        "]))),
                variables: {}
              });

            case 4:
              _yield$_this3$$vfapol = _context3.sent;
              data = _yield$_this3$$vfapol.data;
              commit("setOrder", data.confirmOrder.order);
              commit("setUrl", data.confirmOrder.url);
              _context3.next = 13;
              break;

            case 10:
              _context3.prev = 10;
              _context3.t0 = _context3["catch"](1);
              commit("vuefront/setResponseError", _context3.t0, {
                root: true
              });

            case 13:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[1, 10]]);
    }))();
  }
};