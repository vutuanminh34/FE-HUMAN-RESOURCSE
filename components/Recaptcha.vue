<template>
  <div id="g-recaptcha" class="g-recaptcha" :data-sitekey="sitekey"></div>
</template>

<script>
export default {
  data() {
    return {
      widgetId: 0,
      sitekey: process.env.CAPTCHA_KEY,
    }
  },
  methods: {},
}
</script>

<style></style>
