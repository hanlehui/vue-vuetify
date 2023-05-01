<template>
  <v-app id="inspire" :style="{ background: $vuetify.theme.themes.dark.background }">
    <side-bar />
    <v-container>
      <navbar />
      <v-row>
        <v-col cols="12" sm="8">
          <v-row>
            <v-col cols="12" sm="12">
              <overview />
              <router-view> </router-view>
            </v-col>
            <v-col cols="12" sm="12">
              <money />
            </v-col>
            <v-col cols="12" sm="12">
              <payment />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" sm="4">
          <card />
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import SideBar from '@/frame/components/SideBar.vue'
import Navbar from '@/frame/components/Navbar.vue'
import Overview from '@/frame/components/Overview.vue'
import Money from '@/frame/components/Money.vue'
import Payment from '@/frame/components/Payment.vue'
import Card from '@/frame/components/Card.vue'
export default {
  name: 'PrimaryFrame',
  components: { SideBar, Navbar, Overview, Money, Payment, Card }
}
</script>
<style>
.v-btn.withoutupercase {
  text-transform: none !important;
}
.v-btn:not(.v-btn--round).v-size--small {
  min-width: 30px !important;
  padding: 0 5px !important;
}
</style>
