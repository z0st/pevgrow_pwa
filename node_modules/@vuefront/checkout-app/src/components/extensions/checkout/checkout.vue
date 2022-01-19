<template>
  <div class="vf-e-checkout">
    <vf-o-form v-if="!loading" :button="false" @submit="onSubmit">
      <vf-m-row>
        <vf-m-col md="4" xs="12">
          <vf-o-payment-address
            ref="paymentAddress"
            :delivery="response.shippingAddress.length > 0"
            :address="response.paymentAddress"
            :countries="response.countriesList"
            :zones="paymentZones"
            class="mb-3"
            @updateDeliveryAddress="deliveryAddress = $event"
            @input="updatePaymentAddress"
          />
          <vf-o-shipping-address
            v-if="!deliveryAddress && response.shippingAddress.length > 0"
            ref="shippingAddress"
            :address="response.shippingAddress"
            :countries="response.countriesList"
            :zones="shippingZones"
            @input="updateShippingAddress"
          />
        </vf-m-col>
        <vf-m-col md="8" xs="12">
          <vf-m-row>
            <vf-m-col md="6" xs="12">
              <vf-o-payment-methods
                ref="paymentMethods"
                :methods="response.paymentMethods"
                class="mb-3"
                @input="handlePaymentMethod"
              />
            </vf-m-col>
            <vf-m-col md="6" xs="12">
              <vf-o-shipping-methods
                ref="shippingMethods"
                :methods="response.shippingMethods"
                class="mb-3"
                @input="handleShippingMethod"
              />
            </vf-m-col>
          </vf-m-row>
          <vf-o-checkout-cart :cart="cart" :totals="response.totals" />
          <div class="mt-4 text-right">
            <vf-a-button type="submit" color="primary" :disabled="updating">
              {{ $t("modules.store.checkout.buttonConfirm") }}
              <vf-a-icon :icon="mdiArrowRight" />
            </vf-a-button>
          </div>
        </vf-m-col>
      </vf-m-row>
    </vf-o-form>
    <vf-a-loader v-else />
  </div>
</template>
<script>
import { validationMixin } from "vuelidate";
import { mapGetters } from "vuex";
import debounce from "lodash/debounce";
import isEmpty from "lodash/isEmpty";
import gql from "graphql-tag";
import { mdiArrowRight } from "@mdi/js";
export default {
  mixins: [validationMixin],
  data() {
    return {
      mdiArrowRight,
      debounced: () => {},
      response: {
        shippingAddress: [],
      },
      loading: true,
      deliveryAddress: true,
      paymentMethod: "",
      shippingMethod: "",
      paymentAddress: {},
      paymentAddressId: "",
      shippingAddress: {},
      shippingAddressId: "",
      updating: false,
    };
  },
  computed: {
    ...mapGetters({
      url: "store/checkout/order/url",
      error: "vuefront/error",
      cart: "store/cart/get",
      paymentZones: "store/checkout/paymentAddress/zones",
      shippingZones: "store/checkout/shippingAddress/zones",
    }),
    paymentAddressData() {
      let result = [];

      for (const key in this.paymentAddress) {
        result = [
          ...result,
          {
            name: key,
            value:
              typeof this.paymentAddress[key] !== "string" &&
              this.paymentAddress[key] !== null
                ? JSON.stringify(this.paymentAddress[key])
                : this.paymentAddress[key],
          },
        ];
      }

      return result;
    },
    shippingAddressData() {
      let result = [];

      if (this.deliveryAddress) {
        result = this.paymentAddressData;
      } else {
        for (const key in this.shippingAddress) {
          result = [
            ...result,
            {
              name: key,
              value:
                typeof this.shippingAddress[key] !== "string" &&
                this.shippingAddress[key] !== null
                  ? JSON.stringify(this.shippingAddress[key])
                  : this.shippingAddress[key],
            },
          ];
        }
      }

      return result;
    },
    shippingAddressIdData() {
      let result = null;

      if (this.deliveryAddress) {
        result = this.paymentAddressId;
      } else {
        result = this.shippingAddressId;
      }

      return result;
    },
  },
  watch: {
    cart: {
      handler(val, oldVal) {
        if (val !== oldVal) {
          this.updating = true;
          this.debounced();
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.handleLoad().then(() => {
      this.debounced = debounce(this.updateOrder, 1000);
      this.loading = false;
    });
  },

  methods: {
    async handleLoad() {
      await this.$store.dispatch("store/checkout/order/create");
      const { data } = await this.$vfapollo.query({
        query: this.$options.query,
      });
      this.$store.commit("store/cart/setCart", data.cart);
      this.response = data;
    },
    handlePaymentMethod(val) {
      this.paymentMethod = val;
      this.updating = true;
      this.debounced();
    },
    handleShippingMethod(val) {
      this.shippingMethod = val;
      this.updating = true;
      this.debounced();
    },
    updatePaymentAddress({ addressId, address }) {
      this.paymentAddress = address;
      this.paymentAddressId = addressId;
      this.updating = true;
      this.debounced();
    },
    updateShippingAddress({ addressId, address }) {
      this.shippingAddressId = addressId;
      this.shippingAddress = address;
      this.updating = true;
      this.debounced();
    },
    async updateOrder() {
      this.updating = true;
      const data = await this.$store.dispatch("store/checkout/order/update", {
        paymentAddress: this.paymentAddressData,
        paymentAddressId: this.paymentAddressId,
        shippingAddress: this.shippingAddressData,
        shippingAddressId: this.shippingAddressIdData,
        paymentMethod: this.paymentMethod,
        shippingMethod: this.shippingMethod,
      });
      if (data) {
        this.response = { ...this.response, ...data.updateOrder };
      }
      this.updating = false;
    },
    async onSubmit() {
      this.$refs.paymentAddress.$v.$touch();
      this.$refs.paymentMethods.$v.$touch();
      this.$refs.shippingMethods.$v.$touch();

      if (!this.deliveryAddress) {
        this.$refs.shippingAddress.$v.$touch();
      }

      if (
        !this.$refs.paymentAddress.$v.form.$invalid &&
        !this.$refs.shippingMethods.$v.method.$invalid &&
        !this.$refs.paymentMethods.$v.method.$invalid
      ) {
        if (
          this.deliveryAddress ||
          (!this.deliveryAddress &&
            !this.$refs.shippingAddress.$v.form.$invalid)
        ) {
          this.updating = true;
          await this.$store.dispatch("store/checkout/order/confirm");
          this.updating = false;

          if (isEmpty(this.error)) {
            window.location.href = this.url;
          }
        }
      }
    },
    handleLoaded(response) {
      if (response.cart.products.length === 0) {
        this.$router.push("/store/cart");
      }
      this.$store.commit("store/cart/setCart", response.cart);
      this.$nextTick(() => {
        this.response = { ...response };
      });
    },
  },
};
</script>
<graphql>
{
  countriesList(page: 1, size: -1) {
    content {
      id
      name
    }
  }
  paymentMethods {
    id
    codename
    name
  }
  shippingMethods {
    id
    codename
    name
  }
	paymentAddress {
    agree
    fields {
      type
      name
      label
      required
      defaultValue
      values {
        text
        value
      }
    }
  }
  totals {
    title
    text
  }
  shippingAddress {
    type
    name
    label
    required
    defaultValue
    values {
      text
      value
    }
  }
  cart {
      products {
          key
          quantity
          total
          option {
              name
              value
              type
          }
          product {
              id
              name
              model
              price
              image
              imageLazy
              manufacturer {
                id
                name
                url(url: "/store/manufacturer/_id")
              }
          }
      }
      total
  }
}
</graphql>
