<template>
  <client-only>
    <div class="text-black">
      <apexchart
        :type="typeChart"
        :options="chartOptions"
        :series="series"
        :height="height"
      ></apexchart>
    </div>
  </client-only>
</template>

<script>
// import VueApexCharts from 'vue-apexcharts'
export default {
  components: {
    // VueApexCharts
  },
  props: {
    height: {
      type: String,
      required: false,
      default: "500",
    },
    title: {
      type: String,
      required: false,
      default: "Daily Contracts Deployed",
    },
    typeChart: {
      type: String,
      required: false,
      default: "area",
    },
    dataLabels: {
      type: Boolean,
      required: false,
      default: false,
    },
    dataSeries: {
      type: Array,
      required: false,
      default: () => [
        [1327359600000, 30.95],
        [1327446000000, 31.34],
        [1327532400000, 31.18],
        [1327618800000, 31.05],
        [1327878000000, 31.0],
        [1327964400000, 30.95],
      ],
    },
    categories: {
      type: Array,
      required: false,
      default: []
    }
  },
  data() {
    return {
      series: this.dataSeries,
      chartOptions: {
        chart: {
          id: "area-datetime",
          type: this.typeChart,
          zoom: {
            autoScaleYaxis: true,
          },
        },
        legend: {
          show : true,
          position: 'top',
          labels : {
            colors: 'white'
          }
        },
        colors: [
          "#3B93A5",
          "#F7B844",
          "#ADD8C7",
          "#EC3C65",
          "#CDD7B6",
          "#C1F666",
          "#D43F97",
          "#1E5D8C",
          "#421243",
          "#7F94B0",
          "#EF6537",
          "#C0ADDB",
        ],
        plotOptions: {
          bar: {
            
            colors: {
              ranges: [
                {
                  from: -9999999999,
                  to: 0,
                  color: "#F15B46",
                },
              ],
            },
          },
        },
        grid: {
          show: false,
        },
        title: {
          text: this.title,
          align: "left",
          margin: 20,
          offsetX: 0,
          offsetY: 0,
          floating: false,
          style: {
            fontSize: "1em",
            fontWeight: "bold",
            fontFamily: undefined,
            color: this.$store.state.theme === "dark" ? "white" : "black",
          },
        },
        dataLabels: {
          enabled: this.dataLabels,
        },
        markers: {
          size: 0,
          style: "hollow",
        },
        xaxis: {
          type: "datetime",
          categories: this.categories,
          tickAmount: 6,
          labels: {
            style: {
              colors: this.$store.state.theme === "dark" ? "white" : "black",
            },
          },
        },
        yaxis: {
          labels: {
            formatter: function (value) {
              return Intl.NumberFormat("en", { notation: "compact" }).format(
                value
              );
            },
            style: {
              colors: this.$store.state.theme === "dark" ? "white" : "black",
            },
          },
        },
        tooltip: {
          x: {
            format: "dd MMM yyyy",
          },
        },
        fill:
          this.typeChart === "area"
            ? {
                type: "gradient",
                gradient: {
                  shadeIntensity: 1,
                  opacityFrom: 0.7,
                  opacityTo: 0.1,
                  stops: [0, 100],
                },
              }
            : {},
      },
    };
  },
  mounted() {},
};
</script>
