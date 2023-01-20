<template>
   <div class="bg-slate-900 text-white font-mono">
      <div class="container py-10 min-h-screen flex flex-col gap-y-10">
        <a href="/" class="flex gap-x-2 items-center"><ion-icon name="arrow-back-sharp"></ion-icon> back to home</a>
        <div>
          <div class="text-2xl">Address</div>
          <div>{{ $route.params.id }}</div>
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
              <div class="font-bold">Trade Volume</div>
              <div class="text-xl">{{ new Intl.NumberFormat().format(result.tradeVolume) }}</div>
            </div>
            <div v-else class="grid gap-y-2">
              <Skeleton />
              <Skeleton width="full" />
            </div>
          </div>
        </div>
        <div class="bg-slate-800 p-4 rounded-xl shadow-md">
          <CreateChart v-if="!loading.monthlyVolume" :title="'Weekly Trade Volume and Profit'" typeChart="bar" :dataSeries="result.monthlyVolume.series" :categories="result.monthlyVolume.xaxis" />
          <div v-else>
            loading...
          </div>
        </div>

        <div class="relative overflow-x-auto">
          <div class="bg-gray-800 px-6 py-4 whitespace-nowrap text-medium font-bold w-fit rounded-t-lg">Favorite Path</div>
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

        <div class="relative overflow-x-auto">
          <div class="bg-gray-800 px-6 py-4 whitespace-nowrap text-medium font-bold w-fit rounded-t-lg">List Arb Trade</div>
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

        
      </div>
   </div>
</template>

<script>
import {getToken, getData} from '../../utils/index'
import { queryMonthlyProfit, queryTopArbUser, queryTopPathUser, queryUserOverview } from '../../utils/dataQuery'
export default {
  name: 'arb-trade',
  data(){
    return {
      loading: {
        overview: true,
        monthlyVolume: true,
        topPath: true,
        topArb: true
      },
      result: {
        totalProfit: 0,
        averageProfit: 0,
        tradeVolume: 0,
        monthlyVolume: null,
        topPath: null,
        topArb: null
      }
    }
  },
  mounted(){
    this.runAll()
  },
  methods: {
    runAll(){
      this.fetchOverview();
      this.fetchMonthlyProfit();
      this.fetchListTopPath();
      this.fetchListTopArb();
    },
    async fetchOverview(){
      this.loading.overview = true
      const token = await getToken(queryUserOverview(this.$route.params.id), this.$axios,this.$config.apiKey);
      const result = await getData(token.result, this.$axios, this.$config.apiKey)
      if(result && result.status === 200) {
        this.result.totalProfit = result.result.results[0][1]
        this.result.averageProfit = result.result.results[0][0]
        this.result.tradeVolume = result.result.results[0][2]
        this.loading.overview = false
      }
    },
    async fetchMonthlyProfit(){
      this.loading.monthlyVolume = true
      const token = await getToken(queryMonthlyProfit(this.$route.params.id), this.$axios,this.$config.apiKey);
      const result = await getData(token.result, this.$axios, this.$config.apiKey)
      if(result && result.status === 200) {
        let tempDate = []
        let tempVol = []
        let tempProfit = []
        result.result.results.forEach(element => {
          tempDate.push(element[0])
          tempVol.push(element[2])
          tempProfit.push(element[1])
        });
        this.result.monthlyVolume = {
          series: [
            {
              name: 'Trade Volumes',
              data: tempVol
            },
            {
              name: 'Total Profit',
              data: tempProfit
            }
          ],
          xaxis: tempDate
        }
        console.log(this.result.monthlyVolume)
        this.loading.monthlyVolume = false
      }
    },
    async fetchListTopPath(){
      this.loading.topPath = true
      const token = await getToken(queryTopPathUser(this.$route.params.id), this.$axios,this.$config.apiKey);
      const result = await getData(token.result, this.$axios, this.$config.apiKey)
      if(result && result.status === 200) {
        this.result.topPath = result.result.results
        this.loading.topPath = false
      }
    },
    async fetchListTopArb(){
      this.loading.topArb = true
      const token = await getToken(queryTopArbUser(this.$route.params.id), this.$axios,this.$config.apiKey);
      const result = await getData(token.result, this.$axios, this.$config.apiKey)
      if(result && result.status === 200) {
        this.result.topArb = result.result.results
        this.loading.topArb = false
      }
    },
  }
}
</script>

<style>

</style>