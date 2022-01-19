<template>
  <vf-m-card
    v-show="methods.length > 0"
    class="vf-o-shipping-methods"
    :title="$t('modules.store.checkout.shippingMethodsTitle')"
  >
    <div v-for="value in methods" :key="value.id">
      <vf-a-radio
        v-model="method"
        name="shipping-method"
        :state="$v.method.$dirty ? !$v.method.$error : null"
        :value="value.codename"
        >{{ value.name }}</vf-a-radio
      >
    </div>
  </vf-m-card>
</template>
<script>
import { validationMixin } from "vuelidate";
import required from "vuelidate/lib/validators/required";
export default {
  mixins: [validationMixin],
  props: {
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
      method: null,
    };
  },
  watch: {
    method(value) {
      this.$emit("input", value);
    },
  },
  mounted() {
    if (this.autoSelect && this.methods.length > 0) {
      this.method = this.methods[0].codename;
    }
    this.$emit("input", this.method);
  },
  validations() {
    return {
      method: {
        required,
      },
    };
  },
};
</script>
