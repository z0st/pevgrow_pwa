<template>
  <vf-m-card
    class="vf-e-store-checkout__shipping_address"
    :title="$t('modules.store.checkout.shippingAddressTitle')"
  >
    <vf-o-account-address-select
      v-if="!hideSelectAddress"
      v-model="selectedAddress"
      class="mb-3"
    />
    <vf-a-loader v-if="!zonesLoaded"></vf-a-loader>
    <template v-else-if="!selectedAddress || hideSelectAddress">
      <vf-m-row v-for="(row, rowKey) in getFields" :key="`row_${rowKey}`">
        <vf-m-col
          v-for="(value, index) in row"
          :key="`col_${rowKey}_${index}`"
          xs="12"
          :md="12 / row.length"
        >
          <vf-m-field
            :id="`input-shipping-address-${value.name}`"
            :state="
              $v.form[value.name].$dirty ? !$v.form[value.name].$error : null
            "
          >
            <template #label>
              <span v-if="!value.label">
                {{ $t(`modules.store.checkout.${value.name}`) }}
              </span>
              <span v-else>
                {{ value.label }}
              </span>
            </template>
            <template #default="data">
              <vf-a-input
                v-if="value.type === 'text'"
                v-model="form[value.name]"
                v-bind="data"
                trim
              />
              <vf-a-input
                v-if="value.type === 'datetime'"
                v-model="form[value.name]"
                type="datetime-local"
                v-bind="data"
                trim
              />
              <vf-a-textarea
                v-else-if="value.type === 'textarea'"
                v-model="form[value.name]"
                v-bind="data"
                trim
              />
              <vf-a-select
                v-else-if="value.type === 'select'"
                v-model="form[value.name]"
                :options="value.values"
                v-bind="data"
                no-select
              />
              <vf-a-radio-group
                v-else-if="value.type === 'radio'"
                v-model="form[value.name]"
                :options="value.values"
                v-bind="data"
                stacked
              />
              <vf-a-checkbox-group
                v-else-if="value.type === 'checkbox'"
                v-model="form[value.name]"
                :options="value.values"
                v-bind="data"
                stacked
              />
              <vf-a-datepicker
                v-else-if="value.type === 'date'"
                v-model="form[value.name]"
                v-bind="data"
              />
              <vf-a-timepicker
                v-else-if="value.type === 'time'"
                v-model="form[value.name]"
                v-bind="data"
              />
              <vf-a-select
                v-else-if="value.type === 'zone'"
                v-model="form[value.name]"
                v-bind="data"
                :options="zones.content"
                value-field="id"
                text-field="name"
                no-select
              />
              <vf-a-select
                v-else-if="value.type === 'country'"
                v-model="form[value.name]"
                v-bind="data"
                :options="countries.content"
                value-field="id"
                text-field="name"
                no-select
                @input="handleChangeCountry"
              />
            </template>
            <template #error>
              <span v-if="!value.label">
                {{ $t(`modules.store.checkout.${value.name}Error`) }}
              </span>
              <span v-else>
                {{ value.label }}
                {{ $t(`modules.store.checkout.requiredError`) }}
              </span>
            </template>
          </vf-m-field>
        </vf-m-col>
      </vf-m-row>
    </template>
  </vf-m-card>
</template>
<script>
import { validationMixin } from "vuelidate";
import find from "lodash/find";
import required from "vuelidate/lib/validators/required";
export default {
  mixins: [validationMixin],
  props: {
    value: {
      type: Array,
      default() {
        return [];
      },
    },
    schema: {
      type: Array,
      default() {
        return [1];
      },
    },
    hideSelectAddress: {
      type: Boolean,
      default() {
        return false;
      },
    },
    address: {
      type: Array,
      default() {
        return null;
      },
    },
    countries: {
      type: Object,
      default() {
        return null;
      },
    },
    zones: {
      type: Object,
      default() {
        return null;
      },
    },
  },
  data() {
    const form = {};

    for (const key in this.address) {
      let defaultValue = null;
      if (this.address[key].type === "checkbox") {
        defaultValue = [];
      }
      if (this.address[key].defaultValue) {
        defaultValue = this.address[key].defaultValue;
      }

      const fieldValue = find(this.value, {
        name: this.address[key].name,
      });

      if (fieldValue) {
        try {
          defaultValue = JSON.parse(fieldValue.value);
          if (typeof defaultValue === "number") {
            defaultValue = fieldValue.value;
          }
        } catch (e) {
          defaultValue = fieldValue.value;
        }
      }

      form[this.address[key].name] = defaultValue;
    }

    return {
      form,
      selectedAddress: null,
      zonesLoaded: !form.country_id,
    };
  },
  computed: {
    getFields() {
      const result = [];
      let r = 0;
      const c = 0;
      let countItems = 1;
      let row = [];

      if (r < this.schema.length) {
        countItems = this.schema[r];
      } else if (this.schema.length > 0) {
        countItems = this.schema[this.schema.length - 1];
      }

      for (const key in this.address) {
        if (row.length === countItems) {
          result.push(row);
          row = [];
          r++;
          if (r < this.schema.length) {
            countItems = this.schema[r];
          } else if (this.schema.length > 0) {
            countItems = this.schema[this.schema.length - 1];
          }
        }

        row.push(this.address[key]);
      }

      if (row.length > 0) {
        result.push(row);
      }

      return result;
    },
  },
  watch: {
    form: {
      handler(value, oldValue) {
        this.$emit("input", {
          addressId: this.selectedAddress,
          address: value,
        });
      },
      deep: true,
    },
    selectedAddress: {
      handler(value, oldValue) {
        this.$emit("input", { address: this.form, addressId: value });
      },
      deep: true,
    },
  },
  mounted() {
    if (this.form.country_id) {
      this.$store
        .dispatch("store/checkout/paymentAddress/zones", {
          page: 1,
          size: -1,
          country_id: this.form.country_id,
        })
        .then(() => {
          this.zonesLoaded = true;
        });
    }
    this.$emit("input", {
      addressId: this.selectedAddress,
      address: this.form,
    });
  },
  validations() {
    const fields = {};

    if (this.selectedAddress) {
      return {
        form: {},
      };
    }

    for (const key in this.address) {
      fields[this.address[key].name] = {};
      if (this.address[key].required) {
        fields[this.address[key].name].required = required;
      }
    }

    return {
      form: {
        ...fields,
      },
    };
  },
  methods: {
    async handleChangeCountry(value) {
      await this.$store.dispatch("store/checkout/shippingAddress/zones", {
        page: 1,
        size: -1,
        country_id: value,
      });
    },
  },
};
</script>
