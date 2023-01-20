<template>
  <div class="bg-slate-900 text-white font-mono">
      <div class="container py-10 min-h-screen flex flex-col gap-y-10">
        <div class="font-bold">
          Finding Arbitrage Trader on Osmosis
        </div>
        <div class="bg-gray-800 border-gray-700 rounded-lg shadow-md p-6">
          <div class="font-bold text-lg">Note!</div>
          <div class="italic">data accuracy is very important. so, we only take arbitrage trading that start with stablecoins like USDC/USDC.grv/DAI to buy "X" token e.g USDC swap for ATOM and then swap it again for USDC in 24 Hours</div>
        </div>
        <div class="grid gap-y-4 grid-cols-1 lg:grid lg:grid-cols-3 lg:gap-x-4">
          <div class="bg-slate-800 p-4 rounded-xl shadow-md">
            <div v-if="!loading.overview">
              <div class="font-bold">Total Profit</div>
              <div class="text-xl">$ {{ new Intl.NumberFormat().format(result.totalProfit) }}</div>
            </div>
            <div v-else class="grid gap-y-2">
              <Skeleton />
              <Skeleton width="full" />
            </div>
          </div>
          <div class="bg-slate-800 p-4 rounded-xl shadow-md">
            <div v-if="!loading.overview">
              <div class="font-bold">Average Profit</div>
              <div class="text-xl">$ {{ new Intl.NumberFormat().format(result.averageProfit) }}</div>
            </div>
            <div v-else class="grid gap-y-2">
              <Skeleton />
              <Skeleton width="full" />
            </div>
          </div>
          <div class="bg-slate-800 p-4 rounded-xl shadow-md">
            <div v-if="!loading.overview">
              <div class="font-bold">Unique Arb Trader</div>
              <div class="text-xl">{{ new Intl.NumberFormat().format(result.uniqueTrader) }}</div>
            </div>
            <div v-else class="grid gap-y-2">
              <Skeleton />
              <Skeleton width="full" />
            </div>
          </div>
        </div>
        <div class="relative overflow-x-auto">
          <div class="bg-gray-800 px-6 py-4 whitespace-nowrap text-medium font-bold w-fit rounded-t-lg">Top Arb Traders By Total Profit (USD)</div>
          <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                      <th scope="col" class="px-6 py-3 ">
                          No
                      </th>
                      <th scope="col" class="px-6 py-3">
                          Trader
                      </th>
                      <th scope="col" class="px-6 py-3">
                          Total Arb Trade
                      </th>
                      <th scope="col" class="px-6 py-3 ">
                          Total Profit
                      </th>
                      <th scope="col" class="px-6 py-3 ">
                          
                      </th>
                  </tr>
              </thead>
              <tbody v-if="!loading.topTrader">
                  <tr v-for="(item, index) in result.topTrader" :key="index" class="bg-white dark:bg-gray-800">
                      <th scope="row" class="px-6 py-4 whitespace-nowrap">
                          {{ index + 1}}
                      </th>
                      <td class="px-6 py-4 whitespace-nowrap">
                          {{ item[0] }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                          {{ item[1] }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                         $ {{ new Intl.NumberFormat().format(item[2])  }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                       <a :href="`/arb-trade/${item[0]}`">detail trader <ion-icon name="log-out-outline"></ion-icon></a> 
                      </td>
                  </tr>
              </tbody>
              <tbody v-else>
                <tr class="bg-gray-800">
                  <td colspan="5" class="px-6 py-4 whitespace-nowrap">loading...</td>
                </tr>
              </tbody>
          </table>
        </div>

        <div class="relative overflow-x-auto">
          <div class="bg-gray-800 px-6 py-4 whitespace-nowrap text-medium font-bold w-fit rounded-t-lg">Highest Profit on Single Arb Trade</div>
          <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                      <th scope="col" class="px-6 py-3 ">
                          No
                      </th>
                      <th scope="col" class="px-6 py-3">
                          Trader
                      </th>
                      <th scope="col" class="px-6 py-3">
                          first-tx
                      </th>
                      <th scope="col" class="px-6 py-3 ">
                          from
                      </th>
                       <th scope="col" class="px-6 py-3 ">
                          to
                      </th>
                       <th scope="col" class="px-6 py-3 ">
                          second-tx
                      </th>
                      <th scope="col" class="px-6 py-3 ">
                          from
                      </th>
                       <th scope="col" class="px-6 py-3 ">
                          to
                      </th>
                      <th scope="col" class="px-6 py-3 ">
                          profit
                      </th>
                  </tr>
              </thead>
              <tbody v-if="!loading.topArb">
                  <tr v-for="(item, index) in result.topArb" :key="index" class="bg-white dark:bg-gray-800">
                      <th scope="row" class="px-6 py-4 whitespace-nowrap">
                          {{ index + 1}}
                      </th>
                      <td class="px-6 py-4 whitespace-nowrap">
                         <a class="underline" :href="`https://www.mintscan.io/osmosis/account/${item[1]}`">{{ item[1].slice(0,3) + '...' + item[1].slice(-3) }}</a> 
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                         <a class="underline" :href="`https://www.mintscan.io/osmosis/txs/${item[2]}`" target="_blank">{{ item[2].slice(0,3) + '...' + item[2].slice(-3) }}</a> 
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                         {{ new Intl.NumberFormat().format(item[5])}} {{ item[3]}}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                         {{ new Intl.NumberFormat().format(item[6])}} {{ item[4]}}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                          <a class="underline" :href="`https://www.mintscan.io/osmosis/txs/${item[9]}`" target="_blank">{{ item[9].slice(0,3) + '...' + item[9].slice(-3) }}</a> 
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                          {{ new Intl.NumberFormat().format(item[12]) }}  {{ item[10] }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                          {{ new Intl.NumberFormat().format(item[13]) }}  {{ item[11] }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                          $ {{ new Intl.NumberFormat().format(item[15]) }}
                      </td>
                  </tr>
              </tbody>
              <tbody v-else>
                <tr class="bg-gray-800">
                  <td colspan="9" class="px-6 py-4 whitespace-nowrap">loading...</td>
                </tr>
              </tbody>
          </table>
        </div>

        <div class="relative overflow-x-auto">
          <div class="bg-gray-800 px-6 py-4 whitespace-nowrap text-medium font-bold w-fit rounded-t-lg">Top Path To Arb By Total Profit</div>
          <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                      <th scope="col" class="px-6 py-3 ">
                          No
                      </th>
                      <th scope="col" class="px-6 py-3">
                          Path
                      </th>
                      <th scope="col" class="px-6 py-3">
                          Total Trade
                      </th>
                      <th scope="col" class="px-6 py-3 ">
                          Total Profit
                      </th>
                  </tr>
              </thead>
              <tbody v-if="!loading.topPath">
                  <tr v-for="(item, index) in result.topPath" :key="index" class="bg-white dark:bg-gray-800">
                      <th scope="row" class="px-6 py-4 whitespace-nowrap">
                          {{ index + 1}}
                      </th>
                      <td class="px-6 py-4 whitespace-nowrap">
                          {{ item[0] }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                          {{ item[1] }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                         $ {{ new Intl.NumberFormat().format(item[2])  }}
                      </td>
                  </tr>
              </tbody>
              <tbody v-else>
                <tr class="bg-gray-800">
                  <td colspan="4" class="px-6 py-4 whitespace-nowrap">loading...</td>
                </tr>
              </tbody>
          </table>
        </div>

      </div>
  </div>
</template>

<script>
import {getToken, getData} from '../utils/index'
import { queryOverview, queryTopARb, queryTopPath, queryTopTrader } from '../utils/dataQuery'

export default {
  name: 'IndexPage',
  data(){
    return {
      loading : {
        overview: true,
        topTrader: true,
        topArb: true,
        topPath: true
      },
      result: {
        totalProfit: 0,
        averageProfit: 0,
        uniqueTrader: 0,
        topTrader: null,
        topArb: null,
        topPath: null

      }
    }
  },
  async mounted(){
    this.runAll()

  },
  methods: {
    runAll(){
      this.fetchOverview();
      this.fetchListTopTrader();
      this.fetchListTopArb();
      this.fetchListTopPath();
    },

    async fetchOverview(){
      this.loading.overview = true
      const token = await getToken(queryOverview, this.$axios,this.$config.apiKey);
      const result = await getData(token.result, this.$axios, this.$config.apiKey)
      if(result && result.status === 200) {
        this.result.totalProfit = result.result.results[0][0]
        this.result.averageProfit = result.result.results[0][1]
        this.result.uniqueTrader = result.result.results[0][2]
        this.loading.overview = false
      }
    },
    async fetchListTopTrader(){
      this.loading.topTrader = true
      const token = await getToken(queryTopTrader, this.$axios,this.$config.apiKey);
      const result = await getData(token.result, this.$axios, this.$config.apiKey)
      if(result && result.status === 200) {
        this.result.topTrader = result.result.results
        this.loading.topTrader = false
      }
    },
    async fetchListTopArb(){
      this.loading.topArb = true
      const token = await getToken(queryTopARb, this.$axios,this.$config.apiKey);
      const result = await getData(token.result, this.$axios, this.$config.apiKey)
      if(result && result.status === 200) {
        this.result.topArb = result.result.results
        this.loading.topArb = false
      }
    },
    async fetchListTopPath(){
      this.loading.topPath = true
      const token = await getToken(queryTopPath, this.$axios,this.$config.apiKey);
      const result = await getData(token.result, this.$axios, this.$config.apiKey)
      if(result && result.status === 200) {
        this.result.topPath = result.result.results
        this.loading.topPath = false
      }
    },

    
  }
}
</script>
