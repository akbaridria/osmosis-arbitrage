<template>
  <div>
    <div class="flex animate-pulse">
      <div :class="{'h-[400px]': height === 'big', 'w-36' : width === 'small', 'w-72' : width === 'medium', 'w-full': width === 'full', 'h-6' : height === 'small', 'h-36' : height === 'medium', 'h-full': height === 'full'}"  class="bg-gray-300 rounded-md" >
      </div>
    </div>
</div>
</template>

<script>
export default {
  name: 'skeleton',
  props: {
    width: {
      type: String,
      required: false,
      default: 'medium'
    },
    height: {
      type: String,
      required: false,
      default: 'small'
    }
  }
}
</script>

<style>
</style>
