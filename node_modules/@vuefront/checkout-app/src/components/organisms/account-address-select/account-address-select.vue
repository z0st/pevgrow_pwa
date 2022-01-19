<template>
  <div v-show="$vuefront.isAuth" class="vf-o-account-address-select">
    <vf-o-apollo @loaded="handleLoaded">
      <vf-a-radio-group
        :options="options"
        stacked
        @input="handleInput"
      ></vf-a-radio-group>
    </vf-o-apollo>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: String,
      default() {
        return null;
      },
    },
  },
  data() {
    return {
      addressList: [],
    };
  },
  computed: {
    options() {
      let result = [];

      for (const key in this.addressList) {
        const value = this.addressList[key];
        result = [
          ...result,
          {
            value: value.id,
            text: `${value.firstName} ${value.lastName} ${value.address1}`,
          },
        ];
      }

      result = [
        ...result,
        {
          text: this.$t("modules.store.checkout.text_new_address"),
          value: null,
        },
      ];

      return result;
    },
  },
  methods: {
    handleLoaded(data) {
      this.addressList = data.accountAddressList;
    },
    handleInput(value) {
      this.$emit("input", value);
    },
  },
};
</script>
<graphql>
{
	accountAddressList {
    id
    firstName
    lastName
    address1
    address2
  }
}
</graphql>
