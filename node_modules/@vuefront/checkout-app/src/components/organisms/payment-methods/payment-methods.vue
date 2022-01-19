<template>
  <vf-m-card
    class="vf-o-payment-methods"
    :title="$t('modules.store.checkout.paymentMethodsTitle')"
  >
    <div v-for="item in methods" :key="item.id">
      <vf-a-radio
        v-model="method"
        name="payment-method"
        :value="item.codename"
        :state="$v.method.$dirty ? !$v.method.$error : null"
        >{{ item.name }}</vf-a-radio
      >
    </div>
  </vf-m-card>
</template>
<script>
import { validationMixin } from "vuelidate";
import required from "vuelidate/lib/validators/required";
import includes from "lodash/includes";
export default {
  mixins: [validationMixin],
  props: {
    value: {
      type: String,
      default() {
        return null;
      },
    },
    autoSelect: {
      type: Boolean,
      default() {
        return false;
      },
    },
    methods: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      method: this.value,
    };
  },
  watch: {
    method(value) {
      this.$emit("input", value);
    },
  },
  mounted() {
    if (this.autoSelect && this.methods.length > 0) {
      if (!this.value) {
        this.method = this.methods[0].codename;
      } else if (
        !includes(
          this.methods.map((v) => v.codename),
          this.value
        )
      ) {
        this.method = this.methods[0].codename;
      }
    }
    this.$emit("input", this.method);
  },
  validations() {
    const payment = (value) =>
      includes(
        this.methods.map((v) => v.codename),
        value
      );

    return {
      method: {
        required,
        payment,
      },
    };
  },
};
</script>
